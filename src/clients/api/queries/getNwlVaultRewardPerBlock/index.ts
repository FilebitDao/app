import BigNumber from 'bignumber.js'

import { NwlVault } from 'types/contracts'

export interface GetNwlVaultRewardPerBlockInput {
  nwlVaultContract: NwlVault
  tokenAddress: string
}

export type GetNwlVaultRewardPerBlockOutput = {
  rewardPerBlockWei: BigNumber
}

const getNwlVaultRewardPerBlock = async ({
  nwlVaultContract,
  tokenAddress
}: GetNwlVaultRewardPerBlockInput): Promise<GetNwlVaultRewardPerBlockOutput> => {
  const res = await nwlVaultContract.methods.rewardTokenAmountsPerBlock(tokenAddress).call()

  return {
    rewardPerBlockWei: new BigNumber(res)
  }
}

export default getNwlVaultRewardPerBlock
