import React, { FC, createElement } from 'react'
import { useTranslation } from 'react-i18next'
import { ModalBasicProps, useModal } from 'react-modal-better-hooks'

import classnames from 'classnames'

import { useAuth } from 'clients/web3'

import BaseModal from 'components/Modal'
import Spiner from 'components/Spiner'

import styles from './index.module.scss'
import WALLETS from './wallets'

export const ConnectWalletId = 'ConnectWalletId'

const ConnectWallet: FC<ModalBasicProps<unknown>> = ({ visible }: ModalBasicProps<unknown>) => {
  const { t } = useTranslation()
  const { login, panddingConnector } = useAuth()

  const [, { close }] = useModal(ConnectWalletId)

  return (
    <BaseModal opened={visible} modalId={ConnectWalletId} title={t('connect.connectWallet')}>
      <div className={styles.connectors}>
        {WALLETS.map(wallet => (
          <div
            key={wallet.connector as string}
            className={classnames([
              styles.walletItem,
              wallet.connector === panddingConnector && styles.connecting
            ])}
            onClick={() => login(wallet.connector, close)}
          >
            <div className={styles.connectWrapper}>
              {createElement(wallet.logo, {
                width: 36,
                height: 36
              })}
              <div className={styles.walletInfo}>
                <h3 className={styles.walletName}>{t(wallet.nameLocaleKey)}</h3>
                <p className={styles.desc}>{t(wallet.descLocaleKey)}</p>
              </div>
              {wallet.connector === panddingConnector && (
                <div className={styles.loading}>
                  <Spiner size={24} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </BaseModal>
  )
}

export default ConnectWallet
