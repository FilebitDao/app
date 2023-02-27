import { useContext } from 'react'

import { TransactionModalContext } from 'context/Transaction'

const useTransactionModal = () => useContext(TransactionModalContext)
export default useTransactionModal
