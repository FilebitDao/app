import React, { FC, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { ModalBasicProps, useModal } from 'react-modal-better-hooks'

import RequestWithdraw from './components/RequestWithdraw'
import Withdraw from './components/Withdraw'
import WithdrawNwl from './components/WithdrawNwl'
import BaseModal from 'components/Modal'
import Tab from 'components/Tab'

import { TOKENS } from 'constants/tokens'

import { WithdrawRequestListId, WithdrawRequestListProps } from 'modals/WithdrawRequestList'

import type { Vault } from 'types'

import { unsafelyGetToken } from 'utilities'

import styles from './index.module.scss'

export interface WithdrawAssetProps {
  readonly pool: Vault
}

export const WithdrawAssetId = 'WithdrawAssetId'

const WithdrawAsset: FC<ModalBasicProps<WithdrawAssetProps>> = ({
  visible,
  pool
}: ModalBasicProps<WithdrawAssetProps>) => {
  const { t } = useTranslation()
  const [, { close }] = useModal(WithdrawAssetId)
  const [, { open }] = useModal<WithdrawRequestListProps>(WithdrawRequestListId)
  const token = unsafelyGetToken(pool.stakedTokenId)

  const viewWithdrawRequestList = useCallback(() => {
    close()
    open({
      pool
    })
  }, [pool])

  return (
    <BaseModal
      large
      opened={visible}
      modalId={WithdrawAssetId}
      title={t('withdrawModal.withdraw', {
        symbol: token.symbol
      })}
    >
      {token.address === TOKENS.nwl.address ? (
        <div className={styles.withdrawAsset}>
          <Tab
            small
            tabs={[t('stake.withdraw'), t('withdrawModal.request')]}
            content={[
              <WithdrawNwl pool={pool} key="withdraw" />,
              <RequestWithdraw
                pool={pool}
                viewWithdrawRequestList={viewWithdrawRequestList}
                key="requestWithdraw"
              />
            ]}
          />
        </div>
      ) : (
        <Withdraw pool={pool} />
      )}
    </BaseModal>
  )
}

export default WithdrawAsset
