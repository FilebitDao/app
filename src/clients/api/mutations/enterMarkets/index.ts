import type { TransactionReceipt } from 'web3-core'

import { checkForComptrollerTransactionError } from 'errors'

import { Comptroller } from 'types/contracts'

export interface EnterMarketsInput {
  comptrollerContract: Comptroller
  accountAddress?: string
  nTokenAddresses: string[]
}

export type EnterMarketsOutput = TransactionReceipt

const enterMarkets = async ({
  comptrollerContract,
  accountAddress,
  nTokenAddresses
}: EnterMarketsInput): Promise<EnterMarketsOutput> => {
  const resp = await comptrollerContract.methods
    .enterMarkets(nTokenAddresses)
    .send({ from: accountAddress })
  return checkForComptrollerTransactionError(resp)
}

export default enterMarkets
