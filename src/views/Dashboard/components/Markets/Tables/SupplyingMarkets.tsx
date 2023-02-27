import React, { FC, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useModal } from 'react-modal-better-hooks'

import { useMediaQuery } from '@mui/material'

import { getHypotheticalAccountLiquidity, getNTokenBalanceOf, useExitMarket } from 'clients/api'
import { getNTokenContract, useComptrollerContract } from 'clients/contracts'
import { useAuth, useWeb3 } from 'clients/web3'

import { SupplyWithdraw } from 'components/OperateAsset'
import Switcher from 'components/Switcher'
import Symbol from 'components/Symbol'
import TableContainer, { ColumnType } from 'components/Table'
import { toast } from 'components/Toast'

import { EnableAsCollateralId } from 'modals/EnableAsCollateral'
import type { EnableAsCollateralProps } from 'modals/EnableAsCollateral'
import { SUPPLY_WITHDRAW, SupplyWithdrawId } from 'modals/SupplyWithdraw'
import type { SupplyWithdrawProps } from 'modals/SupplyWithdraw'

import type { Asset } from 'types'

import {
  formatToReadablePercentage,
  formatTokensToReadableValue,
  getBigNumber,
  stringify,
  unsafelyGetNToken
} from 'utilities'

import type { SupplyMarketsProps } from './SupplyMarkets'

const SupplyingMarkets: FC<SupplyMarketsProps> = ({ supplyAssets }: SupplyMarketsProps) => {
  const { t } = useTranslation()
  const [, { open: openEnableAsCollateral }] =
    useModal<EnableAsCollateralProps>(EnableAsCollateralId)
  const [, { open: openSupplyWithdraw }] = useModal<SupplyWithdrawProps>(SupplyWithdrawId)
  const { mutateAsync: exitMarket } = useExitMarket()
  const { accountAddress } = useAuth()
  const web3 = useWeb3()
  const comptrollerContract = useComptrollerContract()
  const shouldHiddenCollateral = useMediaQuery('(min-width:1024px) and (max-width:1280px)')

  const disableAsset = useCallback(
    async (asset: Asset) => {
      try {
        const nToken = unsafelyGetNToken(asset.token.id)

        if (!asset || !asset.borrowBalance.isZero()) {
          toast.error({
            message: t('dashboard.errors.collateralRequired')
          })
          return
        }

        if (asset.collateral) {
          const nTokenContract = getNTokenContract(asset.token.id, web3)
          const nTokenBalanceOf = await getNTokenBalanceOf({
            nTokenContract,
            accountAddress
          })

          const assetHypotheticalLiquidity = await getHypotheticalAccountLiquidity({
            comptrollerContract,
            accountAddress,
            nTokenAddress: nToken.address,
            nTokenBalanceOfWei: getBigNumber(nTokenBalanceOf.balanceWei)
          })

          if (+assetHypotheticalLiquidity['1'] > 0 || +assetHypotheticalLiquidity['2'] === 0) {
            await exitMarket({ ntokenAddress: nToken.address, accountAddress })
          } else {
            toast.error({
              message: t('dashboard.errors.collateralRequired')
            })
          }
        }
      } catch (err) {
        toast.error({
          message: t('dashboard.errors.collateralDisableError', {
            assetName: asset.token.symbol
          })
        })
      }
    },
    [accountAddress]
  )

  const supplyData = useMemo<Asset[]>(
    () =>
      supplyAssets.map(asset => ({
        ...asset,
        apy: asset.nwlSupplyApy.plus(asset.supplyApy)
      })),
    [stringify(supplyAssets)]
  )

  const supplyMarketColumns = useMemo(
    () =>
      [
        {
          label: t('dashboard.assest'),
          render: (row: Asset) => <Symbol icon={row.token.asset} symbol={row.token.symbol} />
        },
        {
          label: t('dashboard.apy'),
          key: 'apy',
          sortable: true,
          render: (row: Asset) => formatToReadablePercentage(row.nwlSupplyApy.plus(row.supplyApy))
        },
        {
          label: t('dashboard.walletBalance'),
          key: 'walletBalance',
          sortable: true,
          render: (row: Asset) =>
            formatTokensToReadableValue({
              value: row.walletBalance,
              token: row.token,
              shortenLargeValue: true,
              minimizeDecimals: true
            })
        },
        {
          label: t('dashboard.supplied'),
          key: 'supplyBalance',
          sortable: true,
          render: (row: Asset) =>
            formatTokensToReadableValue({
              value: row.supplyBalance,
              token: row.token,
              shortenLargeValue: true,
              minimizeDecimals: true
            })
        },
        !shouldHiddenCollateral && {
          label: t('dashboard.collateral'),
          render: (row: Asset) => (
            <Switcher
              checked={row.collateral}
              onEnable={() =>
                openEnableAsCollateral({
                  asset: row
                })
              }
              onDisable={() => disableAsset(row)}
            />
          )
        },
        {
          render: (row: Asset) => (
            <SupplyWithdraw
              onSupply={() =>
                openSupplyWithdraw({
                  type: SUPPLY_WITHDRAW.SUPPLY,
                  asset: row
                })
              }
              onWithdraw={() =>
                openSupplyWithdraw({
                  type: SUPPLY_WITHDRAW.WITHDRAW,
                  asset: row
                })
              }
            />
          )
        }
      ].filter(Boolean) as ColumnType<Asset>[],
    [shouldHiddenCollateral]
  )

  return (
    <TableContainer<Asset>
      collapse
      title={t('dashboard.supply')}
      columns={supplyMarketColumns}
      data={supplyData}
    />
  )
}

export default SupplyingMarkets
