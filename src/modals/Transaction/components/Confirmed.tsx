import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { generateFilScanUrl } from 'utilities'

import { ReactComponent as ComfirmedIcon } from 'assets/img/narwhal/confirmed.svg'

import styles from './index.module.scss'
import type { ModalContentProps } from './type'

const ConfirmedContent: FC<ModalContentProps> = ({
  transactionHash,
  content
}: ModalContentProps) => {
  const { t } = useTranslation()

  return (
    <div className={styles.modalContent}>
      <ComfirmedIcon width={107} height={111} />
      <h1 className={styles.title}>{t('modal.comfirmed')}</h1>
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

export default ConfirmedContent
