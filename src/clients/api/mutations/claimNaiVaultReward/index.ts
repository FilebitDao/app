import { NaiVault } from 'types/contracts'
import type { TransactionReceipt } from 'web3-core/types'

export interface ClaimNaiVaultRewardInput {
  vaiVaultContract: NaiVault
  fromAccountAddress: string
}

export type ClaimNaiVaultRewardOutput = TransactionReceipt

const claimNaiVaultReward = async ({
  vaiVaultContract,
  fromAccountAddress
}: ClaimNaiVaultRewardInput): Promise<ClaimNaiVaultRewardOutput> => {
  const resp = await vaiVaultContract.methods.claim().send({ from: fromAccountAddress })
  return resp
}

export default claimNaiVaultReward
