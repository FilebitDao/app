import React, { FC, PropsWithChildren, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import classnames from 'classnames'

import { useAuth } from 'clients/web3'

import Button from 'components/Button'
import Spiner from 'components/Spiner'
import { toast } from 'components/Toast'

import useTokenApproval from 'hooks/useTokenApproval'

import type { Asset, Token } from 'types'

import styles from './index.module.scss'

interface ApproveTokenProps {
  readonly asset: Asset | Token
  readonly spenderAddress: string
  readonly desc: string
}

const ApproveToken: FC<PropsWithChildren<ApproveTokenProps>> = ({
  children,
  asset,
  spenderAddress,
  desc
}: PropsWithChildren<ApproveTokenProps>) => {
  const { t } = useTranslation()
  const { accountAddress, connected } = useAuth()

  const { isTokenApprovalStatusLoading, isTokenApproved, approveToken, isApproveTokenLoading } =
    useTokenApproval({
      token: (asset as Asset).token ?? asset,
      spenderAddress,
      accountAddress
    })

  const toApprove = useCallback(async () => {
    try {
      await approveToken()
    } catch (e: $TSFixMe) {
      toast.error({
        message: e.message
      })
    }
  }, [approveToken])

  if (isTokenApprovalStatusLoading) {
    return (
      <div className={classnames(['approve-token-loading', styles.approveToken])}>
        <div className={styles.loading}>
          <div className={styles.loadingIcon}>
            <Spiner size={40} />
          </div>
        </div>
      </div>
    )
  }

  if (!isTokenApproved && connected) {
    return (
      <div className={classnames(['approve-token', styles.approveToken])}>
        <p className={styles.desc}>{desc}</p>
        <Button ghost loading={isApproveTokenLoading} onClick={toApprove}>
          {t('dashboard.approve')}
        </Button>
      </div>
    )
  }

  return <>{children}</>
}

export default ApproveToken
