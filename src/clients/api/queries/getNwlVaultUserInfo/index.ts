import { GetNwlVaultUserInfoInput, GetNwlVaultUserInfoOutput } from './types'

import formatToUserInfo from './formatToUserInfo'

export * from './types'

const getNwlVaultUserInfo = async ({
  nwlVaultContract,
  rewardTokenAddress,
  poolIndex,
  accountAddress
}: GetNwlVaultUserInfoInput): Promise<GetNwlVaultUserInfoOutput> => {
  const res = await nwlVaultContract.methods
    .getUserInfo(rewardTokenAddress, poolIndex, accountAddress)
    .call()

  return formatToUserInfo(res)
}

export default getNwlVaultUserInfo
