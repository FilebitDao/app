import { checkForNwlVaultProxyTransactionError } from 'errors'

import { NwlVault } from 'types/contracts'
import type { TransactionReceipt } from 'web3-core/types'

export interface ClaimNwlVaultRewardInput {
  nwlVaultContract: NwlVault
  fromAccountAddress: string
  rewardTokenAddress: string
  poolIndex: number
}

export type ClaimXvsVaultRewardOutput = TransactionReceipt

const claimNwlVaultReward = async ({
  nwlVaultContract,
  fromAccountAddress,
  rewardTokenAddress,
  poolIndex
}: ClaimNwlVaultRewardInput): Promise<ClaimXvsVaultRewardOutput> => {
  const resp = await nwlVaultContract.methods
    .deposit(rewardTokenAddress, poolIndex, 0)
    .send({ from: fromAccountAddress })
  return checkForNwlVaultProxyTransactionError(resp)
}

export default claimNwlVaultReward
