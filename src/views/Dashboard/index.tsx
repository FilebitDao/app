import React, { FC } from 'react'

import classnames from 'classnames'

import { useGetUserMarketInfo } from 'clients/api'
import { useAuth } from 'clients/web3'

import Connect from './components/Connect'
import Markets from './components/Markets'
import UserAssets from './components/UserAssets'

import styles from './index.module.scss'

const DashBoard: FC = () => {
  const { accountAddress, connected } = useAuth()
  const {
    data: {
      assets,
      userTotalBorrowLimitCents,
      userTotalBorrowBalanceCents,
      userTotalSupplyBalanceCents
    }
  } = useGetUserMarketInfo({ accountAddress })

  return (
    <>
      {!connected && <Connect />}
      <div className={classnames({ [styles.unconnected]: !connected })}>
        <UserAssets
          assets={assets}
          userTotalBorrowLimitCents={userTotalBorrowLimitCents}
          userTotalBorrowBalanceCents={userTotalBorrowBalanceCents}
          userTotalSupplyBalanceCents={userTotalSupplyBalanceCents}
        />
        <Markets />
      </div>
    </>
  )
}

export default DashBoard
