import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import styles from './index.module.scss'

const Price: FC = () => {
  const { t } = useTranslation()

  return (
    <div className={styles.price}>
      {t('dashboard.price')}
      <span className={styles.priceText}>$1</span>
    </div>
  )
}

export default Price
