import React, { FC, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import BigNumber from 'bignumber.js'

import useSupply from 'clients/api/mutations/useSupply'
import { useAuth } from 'clients/web3'

import AmountInput from 'components/AmountInput'
import Button from 'components/Button'
import OverviewCard from 'components/OverviewCard'

import useDailyNwlDistributionInterests from 'hooks/useDailyNwlDistributionInterests'
import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation'

import type { Asset } from 'types'

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

export interface SupplyProps {
  readonly asset: Asset
  readonly assets: Asset[]
  readonly userTotalBorrowLimitCents: BigNumber
  readonly userTotalBorrowBalanceCents: BigNumber
}

const Supply: FC<SupplyProps> = ({ asset, assets, userTotalBorrowLimitCents }: SupplyProps) => {
  const [supplyBalance, setSupplyBalance] = useState<number | string>('')
  const { t } = useTranslation()

  const { accountAddress } = useAuth()
  const { mutateAsync: supplyAssest, isLoading: isSupplyLoading } = useSupply({
    asset,
    account: accountAddress
  })

  const handleTransactionMutation = useHandleTransactionMutation()
  const { dailyNwlDistributionInterestsCents } = useDailyNwlDistributionInterests()

  const supplyBigNumber = useMemo(() => getBigNumber(supplyBalance), [supplyBalance])

  const amountValid = useMemo(
    () =>
      !(
        supplyBigNumber.isGreaterThan(asset.walletBalance) ||
        supplyBigNumber.isZero() ||
        supplyBigNumber.isNaN()
      ),
    [supplyBigNumber, asset]
  )

  const walletBalance = useMemo(
    () => ({
      number: asset.walletBalance.toNumber(),
      balanceFormatted: formatTokensToReadableValue({
        value: asset.walletBalance,
        decimal: 15,
        token: asset.token,
        addSymbol: false
      })
    }),
    []
  )

  const buttonState = useMemo(
    () => ({
      disabled: !amountValid,
      text: amountValid ? t('dashboard.supply') : t('enable.amountInValid', { action: 'supply' })
    }),
    [amountValid]
  )

  const borrowLimitChange = useMemo(() => {
    const tokenPrice = getBigNumber(asset?.tokenPrice)
    const originBorrowLimit = formatCentsToReadableValue({
      value: userTotalBorrowLimitCents
    })

    let updateBorrowLimitCents

    if (supplyBigNumber.isZero() || !asset.collateral) {
      return originBorrowLimit
    }

    if (tokenPrice) {
      const amountInCents = calculateCollateralValue({
        amountWei: convertTokensToWei({ value: supplyBigNumber, token: asset.token }),
        token: asset.token,
        tokenPriceTokens: asset.tokenPrice,
        collateralFactor: asset.collateralFactor
      }).times(100)
      updateBorrowLimitCents = userTotalBorrowLimitCents.plus(amountInCents)

      return [
        originBorrowLimit,
        formatCentsToReadableValue({
          value: updateBorrowLimitCents
        })
      ]
    }

    return originBorrowLimit
  }, [supplyBigNumber, asset])

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
        value: asset.supplyBalance.plus(supplyBigNumber)
      })
    ]
  }, [supplyBigNumber, amountValid])

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
      supplyBalance: supplyBigNumber.plus(asset.supplyBalance)
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
      supplyBigNumber.isZero()
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
  }, [supplyBigNumber, stringify(assets)])

  const supply = useCallback(() => {
    handleTransactionMutation({
      mutate: () =>
        supplyAssest({
          amountWei: convertTokensToWei({
            value: supplyBigNumber,
            token: asset.token
          })
        }),
      modalProps: ({ isError, message, error }) => {
        if (isError) {
          return {
            content: (message || error?.message) as string
          }
        }
      }
    })
  }, [supplyBigNumber])

  return (
    <>
      <AmountInput
        disabled={isSupplyLoading}
        value={supplyBalance}
        max={walletBalance.number}
        balance={walletBalance.balanceFormatted}
        symbol={asset.token.symbol}
        onChange={setSupplyBalance}
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
      <Button loading={isSupplyLoading} disabled={buttonState.disabled} onClick={supply}>
        {buttonState.text}
      </Button>
    </>
  )
}

export default Supply
