import React, { FC, PropsWithChildren, ReactElement, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useModal } from 'react-modal-better-hooks'

import { useAuth } from 'clients/web3'

import { ConnectWalletId } from 'modals/ConectWallet'

import styles from './index.module.scss'

interface ConnectWrapperProps {
  readonly unConnected?: string | ReactNode | ReactElement
}

const ConnectWrapper: FC<PropsWithChildren<ConnectWrapperProps>> = ({
  children,
  unConnected
}: PropsWithChildren<ConnectWrapperProps>) => {
  const { connected } = useAuth()
  const { t } = useTranslation()
  const [, { open }] = useModal(ConnectWalletId)

  if (!connected) {
    return (
      <>
        {unConnected ?? (
          <div onClick={open} className={styles.connectWrapper}>
            {t('connect.connectWallet')}
          </div>
        )}
      </>
    )
  }

  return <>{children}</>
}

export default ConnectWrapper
