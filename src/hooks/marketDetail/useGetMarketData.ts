import React from 'react'

import BigNumber from 'bignumber.js'

import { useGetMarkets, useGetNTokenCash } from 'clients/api'

import { BLOCKS_PER_DAY } from 'constants/bsc'
import { COMPOUND_MANTISSA } from 'constants/compoundMantissa'
import { TOKENS } from 'constants/tokens'

import { Token } from 'types'

import {
  convertPercentageFromSmartContract,
  convertWeiToTokens,
  stringify,
  unsafelyGetNToken,
  unsafelyGetToken
} from 'utilities'

export interface MarketDataOutput {
  readonly isLoading?: boolean
  readonly totalBorrowBalanceCents?: number
  readonly totalSupplyBalanceCents?: number
  readonly borrowApyPercentage?: BigNumber
  readonly supplyApyPercentage?: BigNumber
  readonly borrowDistributionApyPercentage?: number
  readonly supplyDistributionApyPercentage?: number
  readonly tokenPriceDollars?: BigNumber
  readonly liquidityCents?: BigNumber
  readonly supplierCount?: number
  readonly borrowerCount?: number
  readonly treasuryTotalSupplyCents?: BigNumber
  readonly treasuryTotalBorrowsCents?: BigNumber
  readonly borrowCapTokens?: BigNumber
  readonly mintedTokens?: BigNumber
  readonly dailyDistributionNwl?: BigNumber
  readonly dailySupplyingInterestsCents?: number
  readonly dailyBorrowingInterestsCents?: number
  readonly reserveFactor?: number
  readonly collateralFactor?: number
  readonly reserveTokens?: BigNumber
  readonly exchangeRateNTokens?: BigNumber
  readonly currentUtilizationRate?: number
  readonly reserveFactorMantissa?: BigNumber
}

const useGetMarketData = ({ nTokenId }: { nTokenId: Token['id'] }) => {
  const { data: nTokenCashData, isLoading: getNTokenCashLoading } = useGetNTokenCash({
    nTokenId
  })

  const { data: getMarketData, isLoading: getMarketsLoading } = useGetMarkets()
  const assetMarket = (getMarketData?.markets || []).find(market => market.id === nTokenId)

  return React.useMemo<MarketDataOutput>(() => {
    const nToken = unsafelyGetNToken(nTokenId)
    const totalBorrowBalanceCents = assetMarket && +assetMarket.totalBorrowsUsd * 100
    const totalSupplyBalanceCents = assetMarket && +assetMarket.totalSupplyUsd * 100
    const borrowApyPercentage = assetMarket?.borrowApy
    const supplyApyPercentage = assetMarket?.supplyApy
    const borrowDistributionApyPercentage = assetMarket && +assetMarket.borrowNarwhalApy
    const supplyDistributionApyPercentage = assetMarket && +assetMarket.supplyNarwhalApy
    const tokenPriceDollars = assetMarket?.tokenPrice
    const liquidityCents = assetMarket && new BigNumber(assetMarket.liquidity).multipliedBy(100)
    const supplierCount = assetMarket?.supplierCount
    const borrowerCount = assetMarket?.borrowerCount
    const borrowCapTokens = assetMarket && new BigNumber(assetMarket.borrowCaps)
    const mintedTokens = assetMarket && new BigNumber(assetMarket.totalSupply2)
    const reserveFactorMantissa = assetMarket && new BigNumber(assetMarket.reserveFactor)

    const dailyDistributionNwl =
      assetMarket &&
      convertWeiToTokens({
        valueWei: new BigNumber(assetMarket.supplierDailyNarwhal).plus(
          assetMarket.borrowerDailyNarwhal
        ),
        token: TOKENS.nwl
      })

    const formattedSupplyRatePerBlock =
      assetMarket &&
      new BigNumber(assetMarket.supplyRatePerBlock).dividedBy(COMPOUND_MANTISSA).toNumber()

    const formattedBorrowRatePerBlock =
      assetMarket &&
      new BigNumber(assetMarket.borrowRatePerBlock).dividedBy(COMPOUND_MANTISSA).toNumber()

    // Calculate daily interests for suppliers and borrowers. Note that we don't
    // use BigNumber to calculate these values, as this would slow down
    // calculation a lot while the end result doesn't need to be extremely
    // precise
    const dailySupplyingInterestsCents =
      assetMarket &&
      formattedSupplyRatePerBlock &&
      // prettier-ignore
      +assetMarket.totalSupplyUsd * (((1 + formattedSupplyRatePerBlock) ** BLOCKS_PER_DAY) - 1) *
      // Convert to cents
      100

    const dailyBorrowingInterestsCents =
      assetMarket &&
      formattedBorrowRatePerBlock &&
      // prettier-ignore
      +assetMarket.totalBorrowsUsd * (((1 + formattedBorrowRatePerBlock) ** BLOCKS_PER_DAY) - 1)
        // Convert to cents
        * 100

    const reserveFactor =
      assetMarket && convertPercentageFromSmartContract(assetMarket.reserveFactor)

    const collateralFactor =
      assetMarket && convertPercentageFromSmartContract(assetMarket.collateralFactor)

    const reserveTokens =
      assetMarket &&
      convertWeiToTokens({
        valueWei: new BigNumber(assetMarket.totalReserves),
        token: nToken.underlyingToken
      })

    const exchangeRateNTokens =
      assetMarket &&
      new BigNumber(1).div(
        new BigNumber(assetMarket.exchangeRate).div(
          new BigNumber(10).pow(18 + unsafelyGetToken(nTokenId).decimals - nToken.decimals)
        )
      )

    let currentUtilizationRate: number | undefined
    if (nTokenCashData?.cashWei && assetMarket && reserveTokens) {
      const nTokenCashTokens = convertWeiToTokens({
        valueWei: nTokenCashData.cashWei,
        token: nToken.underlyingToken
      })

      currentUtilizationRate = new BigNumber(assetMarket.totalBorrows2)
        .div(nTokenCashTokens.plus(assetMarket.totalBorrows2).minus(reserveTokens))
        .multipliedBy(100)
        .dp(0)
        .toNumber()
    }

    const treasuryTotalBorrowsCents = new BigNumber(assetMarket?.totalBorrowsUsd || 0).times(100)
    const treasuryTotalSupplyCents = new BigNumber(assetMarket?.totalSupplyUsd || 0).times(100)

    return {
      isLoading: getMarketsLoading || getNTokenCashLoading,
      totalBorrowBalanceCents,
      totalSupplyBalanceCents,
      borrowApyPercentage,
      supplyApyPercentage,
      borrowDistributionApyPercentage,
      supplyDistributionApyPercentage,
      tokenPriceDollars,
      liquidityCents,
      supplierCount,
      borrowerCount,
      borrowCapTokens,
      mintedTokens,
      dailyDistributionNwl,
      dailySupplyingInterestsCents,
      dailyBorrowingInterestsCents,
      treasuryTotalBorrowsCents,
      treasuryTotalSupplyCents,
      reserveFactor,
      collateralFactor,
      reserveTokens,
      exchangeRateNTokens,
      currentUtilizationRate,
      reserveFactorMantissa
    }
  }, [
    stringify(assetMarket),
    nTokenCashData?.cashWei.toFixed(),
    getNTokenCashLoading,
    getMarketsLoading
  ])
}

export default useGetMarketData
