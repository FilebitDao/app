import BigNumber from 'bignumber.js'

import { NTokenContract } from 'clients/contracts/types'

import { checkForTokenTransactionError } from 'errors'

import type { TransactionReceipt } from 'web3-core/types'

export interface BorrowNTokenInput {
  nTokenContract: NTokenContract<string>
  fromAccountAddress: string
  amountWei: BigNumber
}

export type BorrowNTokenOutput = TransactionReceipt

const borrowVToken = async ({
  nTokenContract,
  fromAccountAddress,
  amountWei
}: BorrowNTokenInput): Promise<BorrowNTokenOutput> => {
  const resp = await nTokenContract.methods
    .borrow(amountWei.toFixed())
    .send({ from: fromAccountAddress })
  return checkForTokenTransactionError(resp)
}

export default borrowVToken
