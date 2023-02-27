import React, { FC, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useModal } from 'react-modal-better-hooks'

import { getHypotheticalAccountLiquidity, getNTokenBalanceOf, useExitMarket } from 'clients/api'
import { getNTokenContract, useComptrollerContract } from 'clients/contracts'
import { useAuth, useWeb3 } from 'clients/web3'

import Accordion from 'components/Accordion'
import { SupplyWithdraw } from 'components/OperateAsset'
import Switcher from 'components/Switcher'
import Symbol from 'components/Symbol'
import { toast } from 'components/Toast'

import { EnableAsCollateralId } from 'modals/EnableAsCollateral'
import type { EnableAsCollateralProps } from 'modals/EnableAsCollateral'
import { SUPPLY_WITHDRAW, SupplyWithdrawId } from 'modals/SupplyWithdraw'
import type { SupplyWithdrawProps } from 'modals/SupplyWithdraw'

import type { Asset } from 'types'

import {
  formatCentsToReadableValue,
  formatToReadablePercentage,
  formatTokensToReadableValue,
  getBigNumber,
  unsafelyGetNToken
} from 'utilities'

import styles from './index.module.scss'

export interface SupplyMarketsProps {
  readonly supplyAssets: Asset[]
}

const SupplyMarkets: FC<SupplyMarketsProps> = ({ supplyAssets }: SupplyMarketsProps) => {
  const { t } = useTranslation()
  const [, { open: openEnableAsCollateral }] =
    useModal<EnableAsCollateralProps>(EnableAsCollateralId)
  const [, { open: openSupplyWithdraw }] = useModal<SupplyWithdrawProps>(SupplyWithdrawId)
  const { mutateAsync: exitMarket } = useExitMarket()
  const { accountAddress } = useAuth()
  const web3 = useWeb3()
  const comptrollerContract = useComptrollerContract()

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

  return (
    <Accordion<Asset>
      title={t('dashboard.supplyMarket')}
      data={supplyAssets}
      getId={market => market.token.address}
      summaryRender={market => <Symbol icon={market.token.asset} symbol={market.token.symbol} />}
      detailRender={market => (
        <div className={styles.detailCard}>
          <div className={styles.cardRow}>
            <span className={styles.cardLabel}>{t('dashboard.apy')}</span>
            <p className={styles.cardValue}>
              {formatToReadablePercentage(market.nwlSupplyApy.plus(market.supplyApy))}
            </p>
          </div>
          <div className={styles.cardRow}>
            <span className={styles.cardLabel}>{t('dashboard.walletBalance')}</span>
            <p className={styles.cardValue}>
              {formatTokensToReadableValue({
                value: market.walletBalance,
                token: market.token,
                shortenLargeValue: true,
                minimizeDecimals: true
              })}
            </p>
          </div>
          <div className={styles.cardRow}>
            <span className={styles.cardLabel}>{t('dashboard.supplied')}</span>
            <p className={styles.cardValue}>
              {formatCentsToReadableValue({
                value: market.treasuryTotalSupplyCents,
                shortenLargeValue: true
              })}
            </p>
          </div>
          <div className={styles.cardRow}>
            <span className={styles.cardLabel}>{t('dashboard.collateral')}</span>
            <Switcher
              checked={market.collateral}
              onEnable={() =>
                openEnableAsCollateral({
                  asset: market
                })
              }
              onDisable={() => disableAsset(market)}
            />
          </div>
          <SupplyWithdraw
            onSupply={() =>
              openSupplyWithdraw({
                type: SUPPLY_WITHDRAW.SUPPLY,
                asset: market
              })
            }
            onWithdraw={() =>
              openSupplyWithdraw({
                type: SUPPLY_WITHDRAW.WITHDRAW,
                asset: market
              })
            }
          />
        </div>
      )}
    />
  )
}

export default SupplyMarkets
