import { checkForNwlVaultProxyTransactionError } from 'errors'

import { NwlVault } from 'types/contracts'
import type { TransactionReceipt } from 'web3-core/types'

export interface ExecuteWithdrawalFromNwlVaultInput {
  nwlVaultContract: NwlVault
  fromAccountAddress: string
  rewardTokenAddress: string
  poolIndex: number
}

export type ExecuteWithdrawalFromNwlVaultOutput = TransactionReceipt

const executeWithdrawalFromNwlVault = async ({
  nwlVaultContract,
  fromAccountAddress,
  rewardTokenAddress,
  poolIndex
}: ExecuteWithdrawalFromNwlVaultInput): Promise<ExecuteWithdrawalFromNwlVaultOutput> => {
  const res = await nwlVaultContract.methods
    .executeWithdrawal(rewardTokenAddress, poolIndex)
    .send({ from: fromAccountAddress })

  return checkForNwlVaultProxyTransactionError(res)
}

export default executeWithdrawalFromNwlVault
