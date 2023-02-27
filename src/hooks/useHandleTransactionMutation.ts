import { toast } from 'components/Toast'

import { NError, formatNErrorToReadableString } from 'errors'

import { TRANSACTION_STATE, TransactionModalProps } from 'modals/Transaction'

import type { TransactionReceipt } from 'web3-core/types'

import useTransactionModal from './useTransactionModal'

interface ModalPropsInput {
  readonly transactionReceipt?: TransactionReceipt
  readonly message?: string
  readonly error?: Error | NError<never>
  readonly isError?: boolean
}

export interface HandleMutationInput {
  mutate: () => Promise<TransactionReceipt | void>
  modalProps?: (
    modalPropsInput: ModalPropsInput
  ) => undefined | Pick<TransactionModalProps, 'content'>
}

const useHandleTransactionMutation = () => {
  const { openTransactionModal, closeTransactionModal } = useTransactionModal()

  const handleMutation = async ({ mutate, modalProps }: HandleMutationInput) => {
    const modalPropsExecuable = typeof modalProps === 'function'
    let passedProps: $TSFixMe = {}
    let transactionReceipt

    try {
      //  FIXME: close loading state when confirmed in wallet
      // openTransactionModal({
      //   state: TRANSACTION_STATE.PANDDING
      // });

      transactionReceipt = await mutate()

      if (transactionReceipt) {
        if (modalPropsExecuable) {
          passedProps = modalProps({
            transactionReceipt
          })
        }

        openTransactionModal({
          transactionHash: transactionReceipt.transactionHash,
          state: TRANSACTION_STATE.CONFIRMED,
          ...(passedProps ?? {})
        })
      }
    } catch (error) {
      closeTransactionModal()
      let { message } = error as Error

      if (error instanceof NError) {
        message = formatNErrorToReadableString(error)
        transactionReceipt = error.receipt
      }

      if (modalPropsExecuable && transactionReceipt) {
        passedProps = modalProps({
          transactionReceipt,
          message,
          error: error as Error | NError<never>,
          isError: true
        })

        openTransactionModal({
          transactionHash: transactionReceipt.transactionHash,
          state: TRANSACTION_STATE.FAILED,
          ...(passedProps ?? {})
        })

        return
      }

      toast.error({
        message
      })
    }
  }

  return handleMutation
}

export default useHandleTransactionMutation
