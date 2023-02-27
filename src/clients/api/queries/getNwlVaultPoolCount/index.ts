import { TOKENS } from 'constants/tokens'

import { NwlVault } from 'types/contracts'

export interface GetNwlVaultPoolCountInput {
  nwlVaultContract: NwlVault
}

export type GetNwlVaultPoolCountOutput = {
  poolCount: number
}

const getNwlVaultPoolCount = async ({
  nwlVaultContract
}: GetNwlVaultPoolCountInput): Promise<GetNwlVaultPoolCountOutput> => {
  const nwlTokenAddress = TOKENS.nwl.address
  const nwlVaultPoolLength = await nwlVaultContract.methods.poolLength(nwlTokenAddress).call()

  return {
    poolCount: +nwlVaultPoolLength
  }
}

export default getNwlVaultPoolCount
