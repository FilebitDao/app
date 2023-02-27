import React, { FC, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import BigNumber from 'bignumber.js'

import { useRepayNToken } from 'clients/api'
import { useAuth } from 'clients/web3'

import AmountInput from 'components/AmountInput'
import Button from 'components/Button'
import OverviewCard from 'components/OverviewCard'

import useDailyNwlDistributionInterests from 'hooks/useDailyNwlDistributionInterests'
import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation'

import {
  calculateDailyEarnings,
  calculatePercentage,
  convertTokensToWei,
  formatCentsToReadableValue,
  formatPercentage,
  formatToReadablePercentage,
  formatTokensToReadableValue,
  getBigNumber,
  stringify
} from 'utilities'

import type { BorrowProps } from './Borrow'

const Repay: FC<BorrowProps> = ({
  asset,
  assets,
  userTotalBorrowLimitCents,
  userTotalBorrowBalanceCents
}: BorrowProps) => {
  const { t } = useTranslation()
  const [repayAmount, setRepayAmount] = useState<number | string>('')
  const { accountAddress } = useAuth()
  const repayAmountBigNumber = useMemo(() => getBigNumber(repayAmount), [repayAmount])

  const handleTransactionMutation = useHandleTransactionMutation()

  const readableTokenBorrowBalance = useMemo(
    () =>
      formatTokensToReadableValue({
        value: asset.borrowBalance,
        token: asset.token,
        decimal: asset.token.decimals,
        addSymbol: false
      }),
    [asset.borrowBalance.toFixed(), asset.token]
  )

  const readableTokenWalletBalance = useMemo(
    () =>
      formatTokensToReadableValue({
        value: asset.walletBalance,
        token: asset.token,
        decimal: asset.token.decimals,
        addSymbol: false
      }),
    [asset.walletBalance.toFixed(), asset.token]
  )

  const maxRepayAmount = useMemo(
    () =>
      formatTokensToReadableValue({
        value: BigNumber.minimum(asset.walletBalance, asset.borrowBalance),
        token: asset.token,
        decimal: asset.token.decimals,
        addSymbol: false
      }),
    [asset.borrowBalance.toFixed(), asset.walletBalance.toFixed(), asset.token]
  )

  const amountValid = useMemo(
    () =>
      !(
        repayAmountBigNumber.isGreaterThan(asset.borrowBalance) ||
        repayAmountBigNumber.isZero() ||
        repayAmountBigNumber.isNaN()
      ),
    [asset.borrowBalance.toFixed(), repayAmountBigNumber]
  )

  const buttonState = useMemo(
    () => ({
      disabled: !amountValid,
      text: amountValid ? t('dashboard.repay') : t('enable.amountInValid', { action: 'repay' })
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

    if (repayAmountBigNumber.isZero()) {
      return formatToReadablePercentage(alreadyUsed)
    }

    return [
      formatToReadablePercentage(alreadyUsed),
      formatToReadablePercentage(
        formatPercentage(
          calculatePercentage({
            numerator: userTotalBorrowBalanceCents
              .minus(asset.tokenPrice.multipliedBy(repayAmountBigNumber).multipliedBy(100))
              .toNumber(),
            denominator: userTotalBorrowLimitCents.toNumber()
          })
        )
      )
    ]
  }, [userTotalBorrowBalanceCents, userTotalBorrowLimitCents, repayAmountBigNumber])

  const borrowBalanceChange = useMemo(() => {
    const alreadyBorrowed = formatCentsToReadableValue({
      value: userTotalBorrowBalanceCents
    })

    if (repayAmountBigNumber.isZero()) {
      return alreadyBorrowed
    }

    return [
      alreadyBorrowed,
      formatCentsToReadableValue({
        value: userTotalBorrowBalanceCents.minus(
          asset.tokenPrice.multipliedBy(repayAmountBigNumber).multipliedBy(100)
        )
      })
    ]
  }, [userTotalBorrowBalanceCents, repayAmountBigNumber])

  const dailyEarningsChange = useMemo(() => {
    const originDailyearnings = formatCentsToReadableValue({
      value: calculateDailyEarnings({
        dailyNwlDistributionInterestsCents,
        assets,
        asset
      })
    })

    if (repayAmountBigNumber.isZero()) {
      return originDailyearnings
    }

    return [
      originDailyearnings,
      formatCentsToReadableValue({
        value: calculateDailyEarnings({
          tokenAmount: repayAmountBigNumber.multipliedBy(-1),
          dailyNwlDistributionInterestsCents,
          assets,
          asset
        })
      })
    ]
  }, [stringify(assets), dailyNwlDistributionInterestsCents, repayAmountBigNumber])

  const { mutateAsync: repayNToken, isLoading: isRepayLoading } = useRepayNToken({
    nTokenId: asset.token.id
  })

  const repay = useCallback(() => {
    const amountWei = convertTokensToWei({
      value: repayAmountBigNumber,
      token: asset.token
    })

    const isRepayingFullLoan = amountWei.eq(
      convertTokensToWei({ value: asset.borrowBalance, token: asset.token })
    )

    handleTransactionMutation({
      mutate: () =>
        repayNToken({
          amountWei,
          isRepayingFullLoan,
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
  }, [repayAmountBigNumber, accountAddress, asset])

  return (
    <>
      <AmountInput
        max={maxRepayAmount}
        balance={readableTokenWalletBalance}
        value={repayAmount}
        onChange={setRepayAmount}
        disabled={isRepayLoading}
        addtionInfo={[
          {
            label: t('amount.currentlyBorrowing'),
            value: readableTokenBorrowBalance
          }
        ]}
      />
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
      <Button disabled={buttonState.disabled} loading={isRepayLoading} onClick={repay}>
        {buttonState.text}
      </Button>
    </>
  )
}

export default Repay
