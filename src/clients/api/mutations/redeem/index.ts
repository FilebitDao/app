import BigNumber from 'bignumber.js'
import type { TransactionReceipt } from 'web3-core'

import { checkForTokenTransactionError } from 'errors'

import { NFrc20 } from 'types/contracts'

export interface RedeemInput {
  tokenContract: NFrc20
  accountAddress: string
  amountWei: BigNumber
}

export type RedeemOutput = TransactionReceipt

const redeem = async ({
  tokenContract,
  accountAddress,
  amountWei
}: RedeemInput): Promise<RedeemOutput> => {
  const resp = await tokenContract.methods
    .redeem(amountWei.toFixed())
    .send({ from: accountAddress })

  return checkForTokenTransactionError(resp)
}

export default redeem
