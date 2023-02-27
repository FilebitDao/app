import BigNumber from 'bignumber.js'

import { NTokenContract } from 'clients/contracts/types'

import MAX_UINT256 from 'constants/maxUint256'

import { checkForTokenTransactionError } from 'errors'

import type { TransactionReceipt } from 'web3-core/types'

export interface RepayNonNativeNTokenInput {
  nTokenContract: NTokenContract<Exclude<string, 'bnb'>>
  fromAccountAddress: string
  amountWei: BigNumber
  isRepayingFullLoan?: boolean
}

export type RepayNonNativeNTokenOutput = TransactionReceipt

const repayNonNativeNToken = async ({
  nTokenContract,
  fromAccountAddress,
  amountWei,
  isRepayingFullLoan = false
}: RepayNonNativeNTokenInput): Promise<RepayNonNativeNTokenOutput> => {
  const resp = await nTokenContract.methods
    .repayBorrow(isRepayingFullLoan ? MAX_UINT256.toFixed() : amountWei.toFixed())
    .send({ from: fromAccountAddress })
  return checkForTokenTransactionError(resp)
}

export default repayNonNativeNToken
