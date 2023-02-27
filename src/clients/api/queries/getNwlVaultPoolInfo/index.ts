import { GetNwlVaultPoolInfoInput, GetNwlVaultPoolInfoOutput } from './types'

import formatToPoolInfo from './formatToPoolInfo'

export * from './types'

const getNwlVaultPoolInfo = async ({
  nwlVaultContract,
  rewardTokenAddress,
  poolIndex
}: GetNwlVaultPoolInfoInput): Promise<GetNwlVaultPoolInfoOutput> => {
  const res = await nwlVaultContract.methods.poolInfos(rewardTokenAddress, poolIndex).call()
  return formatToPoolInfo(res)
}

export default getNwlVaultPoolInfo
