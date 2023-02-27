import type { TransactionReceipt } from 'web3-core'

import { checkForNaiControllerTransactionError } from 'errors'

import { NaiUnitroller } from 'types/contracts'

export interface RepayNaiInput {
  naiControllerContract: NaiUnitroller
  fromAccountAddress: string
  amountWei: string
}

export type IRepayNaiOutput = TransactionReceipt

const repayNai = async ({
  naiControllerContract,
  fromAccountAddress,
  amountWei
}: RepayNaiInput): Promise<IRepayNaiOutput> => {
  const resp = await naiControllerContract.methods
    .repayNAI(amountWei)
    .send({ from: fromAccountAddress })
  return checkForNaiControllerTransactionError(resp)
}

export default repayNai
