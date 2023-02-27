import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import Tab from 'components/Tab'

import MintNai from './MintNai'
import RepayNai from './RepayNai'
import styles from './index.module.scss'

const MintRepay: FC = () => {
  const { t } = useTranslation()

  return (
    <div className={styles.mintRepay}>
      <Tab
        small
        tabs={[t('dashboard.mint'), t('dashboard.repay')]}
        content={[<MintNai />, <RepayNai />]}
      />
    </div>
  )
}

export default MintRepay
