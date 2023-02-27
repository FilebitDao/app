import BigNumber from 'bignumber.js'

import { NarwhalLens } from 'types/contracts'

import { getContractAddress } from 'utilities'

export interface GetNwlRewardInput {
  lensContract: NarwhalLens
  accountAddress: string
}

export type GetNwlRewardOutput = {
  nwlRewardWei: BigNumber
}

const getNwlReward = async ({
  lensContract,
  accountAddress
}: GetNwlRewardInput): Promise<GetNwlRewardOutput> => {
  const res = await lensContract.methods
    .pendingNarwhal(accountAddress, getContractAddress('comptroller'))
    .call()

  return {
    nwlRewardWei: new BigNumber(res)
  }
}

export default getNwlReward
