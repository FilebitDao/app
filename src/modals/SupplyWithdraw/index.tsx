import React, { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { ModalBasicProps } from 'react-modal-better-hooks'

import { useGetUserMarketInfo } from 'clients/api'
import { useAuth } from 'clients/web3'

import Supply from './components/Supply'
import Withdraw from './components/Withdraw'
import ApproveToken from 'components/ApproveToken'
import BaseModal from 'components/Modal'
import Symbol from 'components/Symbol'
import Tab from 'components/Tab'

import type { Asset } from 'types'

import { unsafelyGetNToken } from 'utilities'

import styles from './index.module.scss'

export const SupplyWithdrawId = 'SupplyWithdrawId'

export enum SUPPLY_WITHDRAW {
  SUPPLY = 0,
  WITHDRAW = 1
}

export interface SupplyWithdrawProps {
  readonly type: SUPPLY_WITHDRAW
  readonly asset: Asset
}

const SupplyWithdraw: FC<ModalBasicProps<SupplyWithdrawProps>> = ({
  visible,
  asset,
  type
}: ModalBasicProps<SupplyWithdrawProps>) => {
  const { t } = useTranslation()
  const desc = useMemo(
    () =>
      t('dashboard.needApprove', {
        action: type === SUPPLY_WITHDRAW.SUPPLY ? t('dashboard.supply') : t('dashboard.withdraw'),
        direction: type === SUPPLY_WITHDRAW.SUPPLY ? 'to' : 'from',
        symbol: asset.token.symbol
      }),
    [type]
  )
  const nToken = unsafelyGetNToken(asset.token.id)

  const { accountAddress } = useAuth()
  const {
    data: { assets, userTotalBorrowLimitCents, userTotalBorrowBalanceCents }
  } = useGetUserMarketInfo({ accountAddress })

  return (
    <BaseModal
      large
      titleCenter
      opened={visible}
      modalId={SupplyWithdrawId}
      title={<Symbol symbol={asset.token.symbol} icon={asset.token.asset} iconSize={40} />}
    >
      <ApproveToken asset={asset} desc={desc} spenderAddress={nToken.address}>
        <div className={styles.supplyWithdraw}>
          <Tab
            small
            initialTab={type}
            tabs={[t('dashboard.supply'), t('dashboard.withdraw')]}
            content={[
              <Supply
                key="supply"
                asset={asset}
                assets={assets}
                userTotalBorrowLimitCents={userTotalBorrowLimitCents}
                userTotalBorrowBalanceCents={userTotalBorrowBalanceCents}
              />,
              <Withdraw
                asset={asset}
                assets={assets}
                userTotalBorrowLimitCents={userTotalBorrowLimitCents}
                userTotalBorrowBalanceCents={userTotalBorrowBalanceCents}
                key="withdraw"
              />
            ]}
          />
        </div>
      </ApproveToken>
    </BaseModal>
  )
}

export default SupplyWithdraw
