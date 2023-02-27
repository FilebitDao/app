import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { generateFilScanUrl } from 'utilities'

import { ReactComponent as Failed } from 'assets/img/narwhal/failed.svg'

import styles from './index.module.scss'
import type { ModalContentProps } from './type'

const FailedContent: FC<ModalContentProps> = ({ transactionHash, content }: ModalContentProps) => {
  const { t } = useTranslation()

  return (
    <div className={styles.modalContent}>
      <Failed width={107} height={107} />
      <h1 className={styles.title}>{t('modal.failed')}</h1>
      <p className={styles.content}>{content}</p>
      <a
        className={styles.viewTransaction}
        target="_blank"
        href={generateFilScanUrl(transactionHash as string, 'tx')}
        rel="noreferrer"
      >
        {t('modal.viewTransaction')}
      </a>
    </div>
  )
}

export default FailedContent
