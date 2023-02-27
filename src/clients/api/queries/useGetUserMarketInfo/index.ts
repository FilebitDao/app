import { useMemo } from 'react'

import BigNumber from 'bignumber.js'

import {
  IGetNTokenBalancesAllOutput,
  useGetAssetsInAccount,
  useGetMarkets,
  useGetMintedNai,
  useGetNTokenBalancesAll
} from 'clients/api'

import { NFRC20_TOKENS, TOKENS } from 'constants/tokens'

import { Asset } from 'types'

import {
  calculateCollateralValue,
  convertTokensToWei,
  convertWeiToTokens,
  indexBy,
  stringify,
  unsafelyGetNToken,
  unsafelyGetToken
} from 'utilities'

export interface Data {
  assets: Asset[]
  userTotalBorrowLimitCents: BigNumber
  userTotalBorrowBalanceCents: BigNumber
  userTotalSupplyBalanceCents: BigNumber
  totalNwlDistributedWei: BigNumber
  dailyNarwhalWei: BigNumber
}

export interface UseGetUserMarketInfoOutput {
  isLoading: boolean
  data: Data
}

const nTokenAddresses = Object.values(NFRC20_TOKENS).reduce(
  (acc, item) => (item.address ? [...acc, item.address] : acc),
  [] as string[]
)

const useGetUserMarketInfo = ({
  accountAddress
}: {
  accountAddress?: string
}): UseGetUserMarketInfoOutput => {
  const { data: userMintedNaiData, isLoading: isGetUserMintedNaiLoading } = useGetMintedNai(
    {
      accountAddress: accountAddress || ''
    },
    {
      enabled: !!accountAddress
    }
  )

  const {
    data: getMarketsData = {
      markets: [],
      dailyNarwhalWei: new BigNumber(0)
    },
    isLoading: isGetMarketsLoading
  } = useGetMarkets({
    placeholderData: {
      markets: [],
      dailyNarwhalWei: new BigNumber(0)
    }
  })

  const {
    data: assetsInAccount = {
      tokenAddresses: []
    },
    isLoading: isGetAssetsInAccountLoading
  } = useGetAssetsInAccount(
    { accountAddress: accountAddress || '' },
    {
      enabled: !!accountAddress,
      placeholderData: {
        tokenAddresses: []
      }
    }
  )

  const {
    data: nTokenBalancesAccount = { balances: [] },
    isLoading: isGetNTokenBalancesAccountLoading
  } = useGetNTokenBalancesAll(
    { account: accountAddress || '', nTokenAddresses },
    { enabled: !!accountAddress, placeholderData: { balances: [] } }
  )

  const nTokenBalances = useMemo(
    () =>
      indexBy(
        (item: IGetNTokenBalancesAllOutput['balances'][number]) => item.nToken.toLowerCase(),
        nTokenBalancesAccount.balances
      ),
    [stringify(nTokenBalancesAccount)]
  )

  const isLoading =
    isGetMarketsLoading ||
    isGetAssetsInAccountLoading ||
    isGetNTokenBalancesAccountLoading ||
    isGetUserMintedNaiLoading

  const data = useMemo(() => {
    const {
      assets,
      userTotalBorrowBalanceCents,
      userTotalBorrowLimitCents,
      userTotalSupplyBalanceCents,
      totalNwlDistributedWei
    } = (getMarketsData?.markets || []).reduce(
      (acc, market) => {
        const token = unsafelyGetToken(market.id)
        const nBepToken = unsafelyGetNToken(token.id)

        // Skip token if it isn't listed
        if (!token || !nBepToken) {
          return acc
        }

        const ntokenAddress = nBepToken.address.toLowerCase()
        const collateral = (assetsInAccount.tokenAddresses || [])
          .map((address: string) => address.toLowerCase())
          .includes(ntokenAddress)

        let walletBalance = new BigNumber(0)
        let supplyBalance = new BigNumber(0)
        let borrowBalance = new BigNumber(0)
        const percentOfLimit = '0'

        const wallet = nTokenBalances && nTokenBalances[ntokenAddress]
        if (accountAddress && wallet) {
          const toDecimalAmount = (mantissa: string) =>
            new BigNumber(mantissa).shiftedBy(-token.decimals)

          walletBalance = toDecimalAmount(wallet.tokenBalance)
          supplyBalance = toDecimalAmount(wallet.balanceOfUnderlying)
          borrowBalance = toDecimalAmount(wallet.borrowBalanceCurrent)
        }

        const asset = {
          token,
          supplyApy: new BigNumber(market?.supplyApy || 0),
          borrowApy: new BigNumber(market?.borrowApy || 0),
          nwlSupplyApr: new BigNumber(market?.supplyNarwhalApr || 0),
          nwlSupplyApy: new BigNumber(market?.supplyNarwhalApy || 0),
          nwlBorrowApr: new BigNumber(market?.borrowNarwhalApr || 0),
          nwlBorrowApy: new BigNumber(market?.borrowNarwhalApy || 0),
          collateralFactor: new BigNumber(market?.collateralFactor || 0).div(1e18),
          tokenPrice: new BigNumber(market?.tokenPrice || 0),
          liquidity: new BigNumber(market?.liquidity || 0),
          borrowCaps: new BigNumber(market?.borrowCaps || 0),
          treasuryTotalBorrowsCents: new BigNumber(market?.totalBorrowsUsd || 0).times(100),
          treasuryTotalSupplyCents: new BigNumber(market?.totalSupplyUsd || 0).times(100),
          treasuryTotalSupply: new BigNumber(market?.totalSupply || 0),
          treasuryTotalBorrows: new BigNumber(market?.totalBorrows2 || 0),
          walletBalance,
          supplyBalance,
          borrowBalance,
          collateral,
          percentOfLimit,
          nwlPerDay: new BigNumber(market?.supplierDailyNarwhal || 0)
            .plus(new BigNumber(market?.borrowerDailyNarwhal || 0))
            .div(new BigNumber(10).pow(TOKENS.nwl.decimals))
        }

        // user totals
        const borrowBalanceCents = asset.borrowBalance.times(asset.tokenPrice).times(100)
        const supplyBalanceCents = asset.supplyBalance.times(asset.tokenPrice).times(100)
        acc.userTotalBorrowBalanceCents = acc.userTotalBorrowBalanceCents.plus(borrowBalanceCents)
        acc.userTotalSupplyBalanceCents = acc.userTotalSupplyBalanceCents.plus(supplyBalanceCents)

        acc.totalNwlDistributedWei = acc.totalNwlDistributedWei.plus(
          new BigNumber(market?.totalDistributed || 0).times(
            new BigNumber(10).pow(TOKENS.nwl.decimals)
          )
        )

        // Create borrow limit based on assets supplied as collateral
        if (asset.collateral) {
          acc.userTotalBorrowLimitCents = acc.userTotalBorrowLimitCents.plus(
            calculateCollateralValue({
              amountWei: convertTokensToWei({ value: asset.supplyBalance, token }),
              token: asset.token,
              tokenPriceTokens: asset.tokenPrice,
              collateralFactor: asset.collateralFactor
            }).times(100)
          )
        }

        return { ...acc, assets: [...acc.assets, asset] }
      },
      {
        assets: [] as Asset[],
        userTotalBorrowBalanceCents: new BigNumber(0),
        userTotalBorrowLimitCents: new BigNumber(0),
        userTotalSupplyBalanceCents: new BigNumber(0),
        totalNwlDistributedWei: new BigNumber(0)
      }
    )

    let assetList = assets

    const userTotalBorrowBalanceWithUserMintedNai = userTotalBorrowBalanceCents.plus(
      userMintedNaiData
        ? convertWeiToTokens({
            valueWei: userMintedNaiData.mintedNaiWei,
            token: TOKENS.nai
          }).times(100)
        : 0
    )

    // percent of limit
    assetList = assetList.map((item: Asset) => ({
      ...item,
      percentOfLimit: new BigNumber(userTotalBorrowLimitCents).isZero()
        ? '0'
        : item.borrowBalance
            .times(item.tokenPrice)
            .div(userTotalBorrowLimitCents)
            .times(100)
            .dp(0, 1)
            .toFixed()
    }))

    return {
      assets: assetList,
      userTotalBorrowBalanceCents: userTotalBorrowBalanceWithUserMintedNai,
      userTotalBorrowLimitCents,
      userTotalSupplyBalanceCents,
      dailyNarwhalWei: getMarketsData.dailyNarwhalWei || new BigNumber(0),
      totalNwlDistributedWei
    }
  }, [
    userMintedNaiData?.mintedNaiWei.toFixed(),
    stringify(getMarketsData?.markets),
    stringify(assetsInAccount),
    stringify(nTokenBalances),
    stringify(getMarketsData)
  ])

  return {
    isLoading,
    data
  }
}

export default useGetUserMarketInfo
