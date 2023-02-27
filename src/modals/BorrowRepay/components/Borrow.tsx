import React, { FC, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import BigNumber from 'bignumber.js'

import { useBorrowNToken } from 'clients/api'
import { useAuth } from 'clients/web3'

import AmountInput from 'components/AmountInput'
import Button from 'components/Button'
import OverviewCard from 'components/OverviewCard'
import Warning from 'components/Warning'

import { SAFE_BORROW_LIMIT_PERCENTAGE } from 'constants/safeBorrowLimitPercentage'

import useDailyNwlDistributionInterests from 'hooks/useDailyNwlDistributionInterests'
import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation'

import type { Asset, Token } from 'types'

import {
  calculateDailyEarnings,
  calculatePercentage,
  convertTokensToWei,
  formatCentsToReadableValue,
  formatPercentage,
  formatToReadablePercentage,
  getBigNumber,
  stringify,
  unsafelyGetToken
} from 'utilities'

export interface BorrowProps {
  readonly asset: Asset
  readonly assets: Asset[]
  readonly nToken: Token
  readonly userTotalBorrowLimitCents: BigNumber
  readonly userTotalBorrowBalanceCents: BigNumber
}

const Borrow: FC<BorrowProps> = ({
  asset,
  assets,
  nToken,
  userTotalBorrowLimitCents,
  userTotalBorrowBalanceCents
}: BorrowProps) => {
  const { t } = useTranslation()
  const [borrowAmount, setBorrowAmount] = useState<number | string>('')
  const { accountAddress } = useAuth()
  const borrowAmountBigNumber = useMemo(() => getBigNumber(borrowAmount), [borrowAmount])

  const handleTransactionMutation = useHandleTransactionMutation()

  const [limitTokens, safeLimitTokens] = useMemo(() => {
    if (userTotalBorrowBalanceCents.isGreaterThanOrEqualTo(userTotalBorrowLimitCents)) {
      return ['0', '0']
    }

    const marginWithBorrowLimitDollars = userTotalBorrowLimitCents
      .minus(userTotalBorrowBalanceCents)
      .dividedBy(100)
    const maxTokens = BigNumber.minimum(asset.liquidity, marginWithBorrowLimitDollars)
      // Convert dollars to tokens
      .dividedBy(asset.tokenPrice)

    const safeBorrowLimitCents = userTotalBorrowLimitCents.multipliedBy(
      SAFE_BORROW_LIMIT_PERCENTAGE / 100
    )
    const marginWithSafeBorrowLimitDollars = safeBorrowLimitCents
      .minus(userTotalBorrowBalanceCents)
      // Convert cents to dollars
      .dividedBy(100)

    const safeMaxTokens = userTotalBorrowBalanceCents.isLessThan(safeBorrowLimitCents)
      ? // Convert dollars to tokens
        marginWithSafeBorrowLimitDollars.dividedBy(asset.tokenPrice)
      : new BigNumber(0)

    const tokenDecimals = unsafelyGetToken(asset.token.id).decimals
    const formatValue = (value: BigNumber) =>
      value.dp(tokenDecimals, BigNumber.ROUND_DOWN).toFixed()

    return [formatValue(maxTokens), formatValue(safeMaxTokens)]
  }, [
    asset.token.id,
    asset.tokenPrice,
    asset.liquidity,
    userTotalBorrowLimitCents.toFixed(),
    userTotalBorrowBalanceCents.toFixed()
  ])

  const amountValid = useMemo(
    () =>
      !(
        borrowAmountBigNumber.isGreaterThan(getBigNumber(limitTokens)) ||
        borrowAmountBigNumber.isZero() ||
        borrowAmountBigNumber.isNaN()
      ),
    [limitTokens, borrowAmountBigNumber]
  )

  const buttonState = useMemo(
    () => ({
      disabled: !amountValid,
      text: amountValid ? t('dashboard.borrow') : t('enable.amountInValid', { action: 'borrow' })
    }),
    [amountValid]
  )

  const { dailyNwlDistributionInterestsCents } = useDailyNwlDistributionInterests()

  const borrowLimitPercentage = useMemo(() => {
    const alreadyUsed = formatPercentage(
      calculatePercentage({
        numerator: userTotalBorrowBalanceCents.toNumber(),
        denominator: userTotalBorrowLimitCents.toNumber()
      })
    )

    if (borrowAmountBigNumber.isZero()) {
      return formatToReadablePercentage(alreadyUsed)
    }

    return [
      formatToReadablePercentage(alreadyUsed),
      formatToReadablePercentage(
        formatPercentage(
          calculatePercentage({
            numerator: userTotalBorrowBalanceCents
              .plus(asset.tokenPrice.multipliedBy(borrowAmountBigNumber).multipliedBy(100))
              .toNumber(),
            denominator: userTotalBorrowLimitCents.toNumber()
          })
        )
      )
    ]
  }, [userTotalBorrowBalanceCents, userTotalBorrowLimitCents, borrowAmountBigNumber])

  const borrowBalanceChange = useMemo(() => {
    const alreadyBorrowed = formatCentsToReadableValue({
      value: userTotalBorrowBalanceCents
    })

    if (borrowAmountBigNumber.isZero()) {
      return alreadyBorrowed
    }

    return [
      alreadyBorrowed,
      formatCentsToReadableValue({
        value: userTotalBorrowBalanceCents.plus(
          asset.tokenPrice.multipliedBy(borrowAmountBigNumber).multipliedBy(100)
        )
      })
    ]
  }, [userTotalBorrowBalanceCents, borrowAmountBigNumber])

  const dailyEarningsChange = useMemo(() => {
    const originDailyearnings = formatCentsToReadableValue({
      value: calculateDailyEarnings({
        dailyNwlDistributionInterestsCents,
        assets,
        asset
      })
    })

    if (borrowAmountBigNumber.isZero()) {
      return originDailyearnings
    }

    return [
      originDailyearnings,
      formatCentsToReadableValue({
        value: calculateDailyEarnings({
          tokenAmount: borrowAmountBigNumber,
          dailyNwlDistributionInterestsCents,
          assets,
          asset
        })
      })
    ]
  }, [stringify(assets), dailyNwlDistributionInterestsCents, borrowAmountBigNumber])

  const { mutateAsync: borrowNToken, isLoading: isBorrowLoading } = useBorrowNToken({
    nTokenId: nToken.id
  })

  const isUnSafe = useMemo(
    () => !isBorrowLoading && borrowAmountBigNumber.isGreaterThan(getBigNumber(safeLimitTokens)),
    [safeLimitTokens, borrowAmountBigNumber, isBorrowLoading]
  )

  const borrow = useCallback(() => {
    const amountWei = convertTokensToWei({
      value: borrowAmountBigNumber,
      token: asset.token
    })

    handleTransactionMutation({
      mutate: () =>
        borrowNToken({
          amountWei,
          fromAccountAddress: accountAddress
        }),
      modalProps: ({ isError, message, error }) => {
        if (isError) {
          return {
            content: (message || error?.message) as string
          }
        }
      }
    })
  }, [borrowAmountBigNumber, accountAddress, asset])

  return (
    <>
      <AmountInput
        disabled={isBorrowLoading}
        max={safeLimitTokens}
        balance={limitTokens}
        value={borrowAmount}
        onChange={setBorrowAmount}
        maxLabel={t('amount.limitedMax')}
        balanceLabel={t('amount.borrowableAmount')}
      />
      {isUnSafe && <Warning tip={t('amount.amountTooHigh')} />}
      <OverviewCard
        title={t('overview.transactionOverview')}
        overviews={[
          {
            label: t('overview.borrowApy'),
            value: formatToReadablePercentage(asset.borrowApy)
          },
          {
            label: t('overview.distributionApy'),
            value: formatToReadablePercentage(asset.nwlBorrowApy)
          },
          {
            label: t('enable.borrowLimitUsed'),
            value: borrowLimitPercentage
          },
          {
            label: t('dashboard.borrowBalance'),
            value: borrowBalanceChange
          },
          {
            label: t('dashboard.dailyEarnings'),
            value: dailyEarningsChange
          }
        ]}
      />
      <Button disabled={buttonState.disabled} loading={isBorrowLoading} onClick={borrow}>
        {buttonState.text}
      </Button>
    </>
  )
}

export default Borrow
