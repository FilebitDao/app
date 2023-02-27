import React, { FC, createContext } from 'react'
import { useModal } from 'react-modal-better-hooks'

import TransactionModal, { TransactionId, TransactionModalProps } from 'modals/Transaction'

import { noop } from 'utilities'

interface TransactionModalContextValue {
  openTransactionModal: (params: TransactionModalProps) => void
  closeTransactionModal: () => void
}

export const TransactionModalContext = createContext<TransactionModalContextValue>({
  openTransactionModal: noop,
  closeTransactionModal: noop
})

export const TransactionModalProvider: FC = ({ children }) => {
  const [TransactionModalPlaceholder, { open, closeAll }] = useModal<TransactionModalProps>({
    id: TransactionId,
    render: TransactionModal
  })

  const openTransactionModal = (modalProps: TransactionModalProps) => {
    closeAll()
    open(modalProps)
  }

  return (
    <TransactionModalContext.Provider
      value={{
        openTransactionModal,
        closeTransactionModal: closeAll
      }}
    >
      <>
        {children}
        {TransactionModalPlaceholder}
      </>
    </TransactionModalContext.Provider>
  )
}
