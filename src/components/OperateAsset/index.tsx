import React, { FC } from 'react'
import { Trans } from 'react-i18next'

import classnames from 'classnames'

import useProtectedCallback from 'hooks/useProtectedCallback'

import { noop } from 'utilities'

import styles from './index.module.scss'

interface SupplyWithdrawProps {
  readonly large?: boolean
  onSupply?: () => void
  onWithdraw?: () => void
}

interface DepositBorrowProps {
  readonly large?: boolean
  onDeposit?: () => void
  onBorrow?: () => void
}

interface BorrowRepayProps {
  readonly large?: boolean
  onRepay?: () => void
  onBorrow?: () => void
}

export const SupplyWithdraw: FC<SupplyWithdrawProps> = ({
  large,
  onSupply = noop,
  onWithdraw = noop
}: SupplyWithdrawProps) => {
  const supply = useProtectedCallback(onSupply)
  const withdraw = useProtectedCallback(onWithdraw)

  return (
    <div className={classnames([styles.borrowRepay, 'opreate-asset'])}>
      <span className={classnames([styles.borrow, large && styles.large])} onClick={supply}>
        <Trans i18nKey="dashboard.supply" />
      </span>
      <span className={classnames([styles.repay, large && styles.large])} onClick={withdraw}>
        <Trans i18nKey="dashboard.withdraw" />
      </span>
    </div>
  )
}

export const DepositBorrow: FC<DepositBorrowProps> = ({
  large,
  onBorrow = noop,
  onDeposit = noop
}: DepositBorrowProps) => {
  const borrow = useProtectedCallback(onBorrow)
  const deposit = useProtectedCallback(onDeposit)

  return (
    <div className={classnames([styles.borrowRepay, 'opreate-asset'])}>
      <span className={classnames([styles.borrow, large && styles.large])} onClick={borrow}>
        <Trans i18nKey="dashboard.borrow" />
      </span>
      <span className={classnames([styles.repay, large && styles.large])} onClick={deposit}>
        <Trans i18nKey="dashboard.deposit" />
      </span>
    </div>
  )
}

export const BorrowRepay: FC<BorrowRepayProps> = ({
  large,
  onBorrow = noop,
  onRepay = noop
}: BorrowRepayProps) => {
  const borrow = useProtectedCallback(onBorrow)
  const repay = useProtectedCallback(onRepay)

  return (
    <div className={classnames([styles.borrowRepay, 'opreate-asset'])}>
      <span className={classnames([styles.borrow, large && styles.large])} onClick={borrow}>
        <Trans i18nKey="dashboard.borrow" />
      </span>
      <span className={classnames([styles.repay, large && styles.large])} onClick={repay}>
        <Trans i18nKey="dashboard.repay" />
      </span>
    </div>
  )
}
