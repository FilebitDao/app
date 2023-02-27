import BigNumber from 'bignumber.js'
import type { TransactionReceipt } from 'web3-core'

import { checkForNaiControllerTransactionError } from 'errors'

import { NaiUnitroller } from 'types/contracts'

export interface MintNaiInput {
  naiControllerContract: NaiUnitroller
  fromAccountAddress: string
  amountWei: BigNumber
}

export type MintNaiOutput = TransactionReceipt

const mintNai = async ({
  naiControllerContract,
  fromAccountAddress,
  amountWei
}: MintNaiInput): Promise<MintNaiOutput> => {
  const resp = await naiControllerContract.methods
    .mintNAI(amountWei.toFixed())
    .send({ from: fromAccountAddress })
  return checkForNaiControllerTransactionError(resp)
}

export default mintNai
