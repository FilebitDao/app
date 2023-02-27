import React, { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { ModalBasicProps } from 'react-modal-better-hooks'

import ConfirmedContent from './components/Confirmed'
import FailedContent from './components/Failed'
import PandingContent from './components/Pandding'
import type { ModalContentProps } from './components/type'
import BaseModal from 'components/Modal'

export const TransactionId = 'TransactionId'

export enum TRANSACTION_STATE {
  PANDDING = 0,
  CONFIRMED = 1,
  FAILED = 2
}

export interface TransactionModalProps extends ModalContentProps {
  readonly state: TRANSACTION_STATE
}

const COMPONENT_MAP = {
  [TRANSACTION_STATE.CONFIRMED]: ConfirmedContent,
  [TRANSACTION_STATE.FAILED]: FailedContent,
  [TRANSACTION_STATE.PANDDING]: PandingContent
}

const TITLE_LOCALE_KEY = {
  [TRANSACTION_STATE.CONFIRMED]: 'modal.transactionDetails',
  [TRANSACTION_STATE.FAILED]: 'modal.transactionDetails',
  [TRANSACTION_STATE.PANDDING]: 'modal.pandingConfirm'
}

const TransactionModal: FC<ModalBasicProps<TransactionModalProps>> = ({
  visible,
  content,
  transactionHash,
  state
}: ModalBasicProps<TransactionModalProps>) => {
  const { t } = useTranslation()

  const ModalContent = useMemo(() => COMPONENT_MAP[state], [state])
  const title = useMemo(() => t(TITLE_LOCALE_KEY[state]), [state])
  const modalClosable = useMemo(() => state !== TRANSACTION_STATE.PANDDING, [state])

  return (
    <BaseModal opened={visible} modalId={TransactionId} title={title} closeable={modalClosable}>
      <ModalContent content={content} transactionHash={transactionHash} />
    </BaseModal>
  )
}

export default TransactionModal
