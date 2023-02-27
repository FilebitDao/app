import React, { FC, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ModalBasicProps, useModal } from 'react-modal-better-hooks'

import { format } from 'date-fns'
import { nanoid } from 'nanoid'

import { useGetNwlVaultLockedDeposits } from 'clients/api'
import { useAuth } from 'clients/web3'

import BaseModal from 'components/Modal'

import { TOKENS } from 'constants/tokens'

import { WithdrawAssetId, WithdrawAssetProps } from 'modals/WithdrawAsset'

import type { Vault } from 'types'

import { convertWeiToTokens } from 'utilities'

import styles from './index.module.scss'

export interface WithdrawRequestListProps {
  readonly pool: Vault
}

export const WithdrawRequestListId = 'WithdrawRequestListId'

const WithdrawRequestList: FC<ModalBasicProps<WithdrawRequestListProps>> = ({
  visible,
  pool
}: ModalBasicProps<WithdrawRequestListProps>) => {
  const { t } = useTranslation()
  const [, { close }] = useModal(WithdrawRequestListId)
  const [, { open }] = useModal<WithdrawAssetProps>(WithdrawAssetId)

  const token = TOKENS.nwl

  const { accountAddress } = useAuth()

  const {
    data: userLockedDepositsData = {
      lockedDeposits: []
    },
    isLoading
  } = useGetNwlVaultLockedDeposits(
    {
      poolIndex: pool.poolIndex as number,
      rewardTokenAddress: TOKENS.nwl.address,
      accountAddress
    },
    {
      placeholderData: {
        lockedDeposits: []
      }
    }
  )

  const isEmpty = useMemo(
    () => !isLoading && !userLockedDepositsData.lockedDeposits.length,
    [userLockedDepositsData, isLoading]
  )

  const backToWithdraw = useCallback(() => {
    close()
    open({
      pool
    })
  }, [pool])

  return (
    <BaseModal
      large
      opened={visible}
      onClose={backToWithdraw}
      title={t('withdrawModal.requestList')}
    >
      <div className={styles.withdrawList}>
        {userLockedDepositsData?.lockedDeposits?.map(lockedDeposit => (
          <div className={styles.requestRow} key={nanoid()}>
            <div className={styles.amount}>
              {convertWeiToTokens({
                valueWei: lockedDeposit.amountWei,
                returnInReadableFormat: true,
                addSymbol: true,
                token
              })}
            </div>
            <div className={styles.unlockDate}>
              {t('withdrawModal.lockedUntil', {
                dateTime: format(lockedDeposit.unlockedAt, 'dd MMM yyyy HH:mm aa')
              })}
            </div>
          </div>
        ))}
        {isEmpty && <div className={styles.emptyWithdrawList}>{t('withdrawModal.emptyList')}</div>}
      </div>
    </BaseModal>
  )
}

export default WithdrawRequestList
