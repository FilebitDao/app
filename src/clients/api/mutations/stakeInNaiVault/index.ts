import BigNumber from 'bignumber.js'

import { checkForNaiVaultTransactionError } from 'errors'

import { NaiVault } from 'types/contracts'
import type { TransactionReceipt } from 'web3-core/types'

export interface StakeInNaiVaultInput {
  naiVaultContract: NaiVault
  fromAccountAddress: string
  amountWei: BigNumber
}

export type StakeInNaiVaultOutput = TransactionReceipt

const stakeInNAIVault = async ({
  naiVaultContract,
  fromAccountAddress,
  amountWei
}: StakeInNaiVaultInput): Promise<StakeInNaiVaultOutput> => {
  const resp = await naiVaultContract.methods
    .deposit(amountWei.toFixed())
    .send({ from: fromAccountAddress })
  return checkForNaiVaultTransactionError(resp)
}

export default stakeInNAIVault
