import React, { FC, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useModal } from 'react-modal-better-hooks'

import { useAuth } from 'clients/web3'

import Button from 'components/Button'
import Spiner from 'components/Spiner'

import useClaimVaultReward from 'hooks/useClaimVaultReward'
import useConvertWeiToReadableTokenString from 'hooks/useConvertWeiToReadableTokenString'
import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation'

import { StakeAssetId, StakeAssetProps } from 'modals/StakeAssets'
import { WithdrawAssetId, WithdrawAssetProps } from 'modals/WithdrawAsset'

import { Vault } from 'types'

import {
  convertWeiToTokens,
  formatToReadablePercentage,
  getBigNumber,
  unsafelyGetToken
} from 'utilities'

import styles from './index.module.scss'

interface PoolItemProps {
  readonly pool: Vault
}

const PoolItem: FC<PoolItemProps> = ({ pool }: PoolItemProps) => {
  const { t } = useTranslation()
  const token = unsafelyGetToken(pool.stakedTokenId)
  const rewardToken = unsafelyGetToken(pool.rewardTokenId)

  const { accountAddress } = useAuth()

  const [, { open: stakeAssets }] = useModal<StakeAssetProps>(StakeAssetId)
  const [, { open: withdrawAssets }] = useModal<WithdrawAssetProps>(WithdrawAssetId)

  const { claimReward, isLoading: isClaiming } = useClaimVaultReward()
  const handleTransactionMutation = useHandleTransactionMutation()

  const readableUserStakingTokens = useConvertWeiToReadableTokenString({
    valueWei: pool.userStakedWei || getBigNumber(0),
    minimizeDecimals: true,
    addSymbol: false,
    token
  })

  const readableUserPendingRewardTokens = useConvertWeiToReadableTokenString({
    valueWei: pool.userPendingRewardWei,
    token: rewardToken,
    minimizeDecimals: true,
    addSymbol: true
  })

  const toStake = useCallback(
    () =>
      stakeAssets({
        pool
      }),
    [pool]
  )

  const toWithdraw = useCallback(
    () =>
      withdrawAssets({
        pool
      }),
    [pool]
  )

  const cliamAble = useMemo(
    () => pool.userPendingRewardWei?.isGreaterThan(0),
    [pool.userPendingRewardWei]
  )

  const stakeApr = useMemo(
    () =>
      pool.totalStakedWei.isEqualTo(0)
        ? '--'
        : formatToReadablePercentage(pool.stakingAprPercentage),
    [pool.totalStakedWei, pool.stakingAprPercentage]
  )

  const claim = useCallback(() => {
    handleTransactionMutation({
      mutate: () =>
        claimReward({
          accountAddress,
          rewardTokenId: pool.rewardTokenId,
          stakedTokenId: pool.stakedTokenId,
          poolIndex: pool.poolIndex as number
        }),
      modalProps: ({ isError, message, error }) => {
        if (isError) {
          return {
            content: (message || error?.message) as string
          }
        }
      }
    })
  }, [claimReward, accountAddress, pool])

  return (
    <div className={styles.poolItem}>
      <div className={styles.stakeInfo}>
        <div className={styles.tokenInfo}>
          <img src={token.asset} className={styles.tokenAsset} />
          <span className={styles.tokenName}>{token.symbol}</span>
        </div>
        {cliamAble && (
          <div className={styles.rewardInfo}>
            {t('stake.reward')}
            <span className={styles.rewardAmount}>{readableUserPendingRewardTokens}</span>
            <span onClick={claim} className={styles.claim}>
              {t('stake.claim')}
              {isClaiming && <Spiner size={18} />}
            </span>
          </div>
        )}
      </div>
      <div className={styles.userStaked}>
        <p className={styles.tip}>{t('stake.userStaked')}</p>
        <div className={styles.amountWrapper}>
          <img src={token.asset} className={styles.tokenAsset} />
          <span className={styles.amount}>{readableUserStakingTokens}</span>
        </div>
      </div>
      <div className={styles.poolStatistics}>
        <div className={styles.statisticsPart}>
          <span className={styles.label}>{t('stake.stakeApr', { symbol: token.symbol })}</span>
          <div className={styles.valueWrapper}>
            <p className={styles.value}>{stakeApr}</p>
          </div>
        </div>
        <div className={styles.statisticsPart}>
          <span className={styles.label}>{t('stake.dailyEmission')}</span>
          <div className={styles.valueWrapper}>
            <img src={rewardToken.asset} className={styles.tokenAsset} />
            <p className={styles.value}>
              {convertWeiToTokens({
                valueWei: pool.dailyEmissionWei,
                token: rewardToken,
                returnInReadableFormat: true,
                decimal: 2,
                addSymbol: false
              })}
            </p>
          </div>
        </div>
        <div className={styles.statisticsPart}>
          <span className={styles.label}>{t('stake.totalStaked', { symbol: token.symbol })}</span>
          <div className={styles.valueWrapper}>
            <img src={token.asset} className={styles.tokenAsset} />
            <p className={styles.value}>
              {convertWeiToTokens({
                valueWei: pool.totalStakedWei,
                returnInReadableFormat: true,
                decimal: 2,
                shortenLargeValue: true,
                addSymbol: false,
                token
              })}
            </p>
          </div>
        </div>
      </div>
      <div className={styles.poolButtons}>
        <Button onClick={toStake} protect>
          {t('stake.stake')}
        </Button>
        <Button onClick={toWithdraw} protect ghost>
          {t('stake.withdraw')}
        </Button>
      </div>
    </div>
  )
}

export default PoolItem
