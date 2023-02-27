import BigNumber from 'bignumber.js'

import { NwlVault } from 'types/contracts'

export interface GetNwlVaultPendingRewardInput {
  nwlVaultContract: NwlVault
  rewardTokenAddress: string
  poolIndex: number
  accountAddress: string
}

export type GetNwlVaultPendingRewardOutput = {
  pendingNWLReward: BigNumber
}

const getNwlVaultPendingReward = async ({
  nwlVaultContract,
  rewardTokenAddress,
  poolIndex,
  accountAddress
}: GetNwlVaultPendingRewardInput): Promise<GetNwlVaultPendingRewardOutput> => {
  const res = await nwlVaultContract.methods
    .pendingReward(rewardTokenAddress, poolIndex, accountAddress)
    .call()

  return {
    pendingNWLReward: new BigNumber(res)
  }
}

export default getNwlVaultPendingReward
