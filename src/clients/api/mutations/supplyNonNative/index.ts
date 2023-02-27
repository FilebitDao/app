import BigNumber from 'bignumber.js'
import type { TransactionReceipt } from 'web3-core'

import { checkForTokenTransactionError } from 'errors'

import { NFrc20 } from 'types/contracts'

export interface SupplyNonNativeInput {
  tokenContract: NFrc20
  account: string
  amountWei: BigNumber
}

export type SupplyNonNativeOutput = TransactionReceipt

const supplyNonNative = async ({
  tokenContract,
  account,
  amountWei
}: SupplyNonNativeInput): Promise<SupplyNonNativeOutput> => {
  const resp = await tokenContract.methods.mint(amountWei.toFixed()).send({ from: account })
  return checkForTokenTransactionError(resp)
}

export default supplyNonNative
