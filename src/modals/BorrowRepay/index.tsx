import React, { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { ModalBasicProps } from 'react-modal-better-hooks'

import { useGetUserMarketInfo } from 'clients/api'
import { useAuth } from 'clients/web3'

import Borrow from './components/Borrow'
import Repay from './components/Repay'
import ApproveToken from 'components/ApproveToken'
import BaseModal from 'components/Modal'
import Symbol from 'components/Symbol'
import Tab from 'components/Tab'

import type { Asset } from 'types'

import { unsafelyGetNToken } from 'utilities'

import styles from './index.module.scss'

export const BorrowRepayId = 'BorrowRepayId'

export enum BORROW_REPAY {
  BORROW = 0,
  REPAY = 1
}

export interface BorrowRepayProps {
  readonly type: BORROW_REPAY
  readonly asset: Asset
}

const BorrowRepay: FC<ModalBasicProps<BorrowRepayProps>> = ({
  visible,
  asset,
  type
}: ModalBasicProps<BorrowRepayProps>) => {
  const { t } = useTranslation()
  const desc = useMemo(
    () =>
      t('dashboard.needApprove', {
        action: type === BORROW_REPAY.BORROW ? t('dashboard.borrow') : t('dashboard.repay'),
        direction: type === BORROW_REPAY.BORROW ? 'from' : 'to',
        symbol: asset.token.symbol
      }),
    [type]
  )
  const nToken = unsafelyGetNToken(asset.token.id)

  const { accountAddress } = useAuth()
  const {
    data: { assets, userTotalBorrowBalanceCents, userTotalBorrowLimitCents }
  } = useGetUserMarketInfo({
    accountAddress
  })

  return (
    <BaseModal
      large
      titleCenter
      opened={visible}
      modalId={BorrowRepayId}
      title={<Symbol symbol={asset.token.symbol} icon={asset.token.asset} iconSize={40} />}
    >
      <ApproveToken asset={asset} desc={desc} spenderAddress={nToken.address}>
        <div className={styles.borrowRepay}>
          <Tab
            small
            initialTab={type}
            tabs={[t('dashboard.borrow'), t('dashboard.repay')]}
            content={[
              <Borrow
                key="borrow"
                asset={asset}
                assets={assets}
                nToken={nToken}
                userTotalBorrowBalanceCents={userTotalBorrowBalanceCents}
                userTotalBorrowLimitCents={userTotalBorrowLimitCents}
              />,
              <Repay
                key="repay"
                asset={asset}
                assets={assets}
                nToken={nToken}
                userTotalBorrowBalanceCents={userTotalBorrowBalanceCents}
                userTotalBorrowLimitCents={userTotalBorrowLimitCents}
              />
            ]}
          />
        </div>
      </ApproveToken>
    </BaseModal>
  )
}

export default BorrowRepay
