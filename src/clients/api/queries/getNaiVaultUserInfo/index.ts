import { GetNaiVaultUserInfoInput, GetNaiVaultUserInfoOutput } from './types'

import formatToUserInfo from './formatToUserInfo'

export * from './types'

const getNaiVaultUserInfo = async ({
  naiVaultContract,
  accountAddress
}: GetNaiVaultUserInfoInput): Promise<GetNaiVaultUserInfoOutput> => {
  const res = await naiVaultContract.methods.userInfo(accountAddress).call()
  return formatToUserInfo(res)
}

export default getNaiVaultUserInfo
