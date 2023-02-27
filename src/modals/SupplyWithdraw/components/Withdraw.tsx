import React, { FC, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import BigNumber from 'bignumber.js'

import { useGetNTokenBalanceOf, useRedeem, useRedeemUnderlying } from 'clients/api'
import { useAuth } from 'clients/web3'

import AmountInput from 'components/AmountInput'
import Button from 'components/Button'
import OverviewCard from 'components/OverviewCard'

import useDailyNwlDistributionInterests from 'hooks/useDailyNwlDistributionInterests'
import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation'

import {
  calculateCollateralValue,
  calculateDailyEarningsCents,
  calculateYearlyEarningsForAssets,
  convertTokensToWei,
  formatCentsToReadableValue,
  formatToReadablePercentage,
  formatTokensToReadableValue,
  getBigNumber
} from 'utilities'
import stringify from 'utilities/stringify'

import type { SupplyProps } from './Supply'

const Withdraw: FC<SupplyProps> = ({
  asset,
  assets,
  userTotalBorrowLimitCents,
  userTotalBorrowBalanceCents
}: SupplyProps) => {
  const [withdrawAmount, setWithdrawAmount] = useState<number | string>('')
  const { t } = useTranslation()

  const { accountAddress } = useAuth()

  const { dailyNwlDistributionInterestsCents } = useDailyNwlDistributionInterests()
  const handleTransactionMutation = useHandleTransactionMutation()

  const withdrawBigNumber = useMemo(() => getBigNumber(withdrawAmount), [withdrawAmount])

  const maxInput = React.useMemo(() => {
    if (!asset.collateral) {
      return asset.supplyBalance
    }

    if (userTotalBorrowBalanceCents.isGreaterThanOrEqualTo(userTotalBorrowLimitCents)) {
      return new BigNumber(0)
    }

    const marginWithBorrowLimitDollars = userTotalBorrowLimitCents
      .minus(userTotalBorrowBalanceCents)
      .dividedBy(100)

    const collateralAmountPerTokenDollars = asset.tokenPrice.multipliedBy(asset.collateralFactor)
    const maxTokensBeforeLiquidation = marginWithBorrowLimitDollars
      .dividedBy(collateralAmountPerTokenDollars)
      .dp(asset.token.decimals, BigNumber.ROUND_DOWN)

    return BigNumber.minimum(maxTokensBeforeLiquidation, asset.supplyBalance)
  }, [])

  const amountValid = useMemo(
    () =>
      !(
        withdrawBigNumber.isGreaterThan(maxInput) ||
        withdrawBigNumber.isZero() ||
        withdrawBigNumber.isNaN()
      ),
    [withdrawBigNumber, maxInput]
  )

  const supplyBalance = useMemo(
    () => ({
      number: maxInput.toNumber(),
      balanceFormatted: formatTokensToReadableValue({
        value: maxInput,
        decimal: asset.token.decimals,
        token: asset.token,
        addSymbol: false
      })
    }),
    [maxInput]
  )

  const buttonState = useMemo(
    () => ({
      disabled: !amountValid,
      text: amountValid
        ? t('dashboard.withdraw')
        : t('enable.amountInValid', { action: 'withdraw' })
    }),
    [amountValid]
  )

  const borrowLimitChange = useMemo(() => {
    const tokenPrice = getBigNumber(asset?.tokenPrice)
    const originBorrowLimit = formatCentsToReadableValue({
      value: userTotalBorrowLimitCents
    })

    let updateBorrowLimitCents

    if (withdrawBigNumber.isZero() || !asset.collateral) {
      return originBorrowLimit
    }

    if (tokenPrice) {
      const amountOutCents = calculateCollateralValue({
        amountWei: convertTokensToWei({ value: withdrawBigNumber, token: asset.token }),
        token: asset.token,
        tokenPriceTokens: asset.tokenPrice,
        collateralFactor: asset.collateralFactor
      }).times(100)
      updateBorrowLimitCents = userTotalBorrowLimitCents.minus(amountOutCents)

      return [
        originBorrowLimit,
        formatCentsToReadableValue({
          value: updateBorrowLimitCents
        })
      ]
    }

    return originBorrowLimit
  }, [withdrawBigNumber, asset])

  const supplyBalanceChange = useMemo(() => {
    const alreadySupplied = formatTokensToReadableValue({
      token: asset.token,
      addSymbol: false,
      value: asset.supplyBalance
    })

    if (!amountValid) {
      return alreadySupplied
    }

    return [
      alreadySupplied,
      formatTokensToReadableValue({
        token: asset.token,
        addSymbol: false,
        value: asset.supplyBalance.minus(withdrawBigNumber)
      })
    ]
  }, [withdrawBigNumber, amountValid])

  const dailyEarningsChange = useMemo(() => {
    const hypotheticalAssets = [...assets]
    const yearlyEarningsCents =
      dailyNwlDistributionInterestsCents &&
      calculateYearlyEarningsForAssets({
        assets,
        dailyNwlDistributionInterestsCents
      })
    const dailyEarningsCentsValue =
      yearlyEarningsCents && calculateDailyEarningsCents(yearlyEarningsCents)
    const hypotheticalAsset = {
      ...asset,
      supplyBalance: asset.supplyBalance.minus(withdrawBigNumber)
    }
    const currentIndex = assets.findIndex(a => a.token.address === asset.token.address)
    hypotheticalAssets.splice(currentIndex, 1, hypotheticalAsset)
    const hypotheticalYearlyEarningsCents =
      dailyNwlDistributionInterestsCents &&
      calculateYearlyEarningsForAssets({
        assets: hypotheticalAssets,
        dailyNwlDistributionInterestsCents
      })
    const hypotheticalDailyEarningCentsValue =
      hypotheticalYearlyEarningsCents &&
      calculateDailyEarningsCents(hypotheticalYearlyEarningsCents)

    if (
      dailyEarningsCentsValue?.isEqualTo(hypotheticalDailyEarningCentsValue || getBigNumber(0)) ||
      withdrawBigNumber.isZero()
    ) {
      return formatCentsToReadableValue({
        value: dailyEarningsCentsValue
      })
    }

    return [
      formatCentsToReadableValue({
        value: dailyEarningsCentsValue
      }),
      formatCentsToReadableValue({
        value: hypotheticalDailyEarningCentsValue
      })
    ]
  }, [withdrawBigNumber, stringify(assets)])

  const { data: nTokenBalanceData } = useGetNTokenBalanceOf(
    { accountAddress, nTokenId: asset.token.id },
    { enabled: Boolean(accountAddress) }
  )

  const { mutateAsync: redeem, isLoading: isRedeemLoading } = useRedeem({
    nTokenId: asset?.token.id,
    accountAddress
  })

  const { mutateAsync: redeemUnderlying, isLoading: isRedeemUnderlyingLoading } =
    useRedeemUnderlying({
      nTokenId: asset?.token.id,
      accountAddress
    })

  const isWithdrawLoading = useMemo(
    () => isRedeemLoading || isRedeemUnderlyingLoading,
    [isRedeemLoading, isRedeemUnderlyingLoading]
  )

  const withdraw = useCallback(() => {
    handleTransactionMutation({
      mutate: async () => {
        const amountEqualsSupplyBalance = withdrawBigNumber.isEqualTo(asset.supplyBalance)
        if (amountEqualsSupplyBalance && nTokenBalanceData?.balanceWei) {
          await redeem({ amountWei: new BigNumber(nTokenBalanceData.balanceWei) })
        } else {
          const withdrawAmountWei = convertTokensToWei({
            value: withdrawBigNumber,
            token: asset.token
          })
          await redeemUnderlying({
            amountWei: withdrawAmountWei
          })
        }
      },
      modalProps: ({ isError, message, error }) => {
        if (isError) {
          return {
            content: (message || error?.message) as string
          }
        }
      }
    })
  }, [withdrawBigNumber])

  return (
    <>
      <AmountInput
        disabled={isWithdrawLoading}
        value={withdrawAmount}
        max={supplyBalance.number}
        balance={supplyBalance.balanceFormatted}
        symbol={asset.token.symbol}
        onChange={setWithdrawAmount}
      />
      <OverviewCard
        title={t('overview.transactionOverview')}
        overviews={[
          {
            label: t('overview.supplyApy'),
            value: formatToReadablePercentage(asset.supplyApy)
          },
          {
            label: t('overview.distributionApy'),
            value: formatToReadablePercentage(asset.nwlSupplyApy)
          },
          {
            label: t('enable.borrowLimit'),
            value: borrowLimitChange
          },
          {
            label: t('dashboard.dailyEarnings'),
            value: dailyEarningsChange
          },
          {
            label: t('overview.supplyBalance'),
            value: supplyBalanceChange
          }
        ]}
      />
      <Button disabled={buttonState.disabled} loading={isWithdrawLoading} onClick={withdraw}>
        {buttonState.text}
      </Button>
    </>
  )
}

export default Withdraw
