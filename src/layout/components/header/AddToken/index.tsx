import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import useAddToken from 'hooks/useAddToken'

import styles from './index.module.scss'

const AddToken: FC = () => {
  const { t } = useTranslation()
  const addTokenAction = useAddToken()

  return (
    <div className={styles.addToken} onClick={addTokenAction}>
      {t('header.addToken')}
    </div>
  )
}

export default AddToken
