import type { TransactionReceipt } from 'web3-core'

import { checkForTokenTransactionError } from 'errors'

import { Faucet } from 'types/contracts'

export interface ClaimFaucetInput {
  faucetContract: Faucet
  symbol: string
  accountAddress?: string
}

export type ClaimFaucetOutput = TransactionReceipt

const claimFaucet = async ({
  faucetContract,
  symbol,
  accountAddress
}: ClaimFaucetInput): Promise<ClaimFaucetOutput> => {
  const resp = await faucetContract.methods.claim(symbol).send({ from: accountAddress })
  return checkForTokenTransactionError(resp)
}

export default claimFaucet
