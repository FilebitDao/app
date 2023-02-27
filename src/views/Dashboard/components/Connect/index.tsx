import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import Button from 'components/Button'

import useConnectWallet from 'hooks/useConnectWallet'

import { ReactComponent as ConnectIcon } from 'assets/img/narwhal/connect.svg'

import styles from './index.module.scss'

const Connect: FC = () => {
  const { t } = useTranslation()
  const connectWallet = useConnectWallet()

  return (
    <div className={styles.connect}>
      <ConnectIcon width={220} height={238} />
      <h1 className={styles.connectTitle}>{t('connect.pleaseConnect')}</h1>
      <p className={styles.connectDesc}>{t('connect.pleaseConnectDesc')}</p>
      <Button onClick={connectWallet}>{t('connect.connectWallet')}</Button>
    </div>
  )
}

export default Connect
