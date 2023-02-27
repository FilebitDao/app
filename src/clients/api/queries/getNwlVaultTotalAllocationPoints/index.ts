import { NwlVault } from 'types/contracts'

export interface GetNwlVaultTotalAllocPointsInput {
  nwlVaultContract: NwlVault
  tokenAddress: string
}

export type GetNwlVaultTotalAllocPointsOutput = {
  totalAllocationPoints: number
}

const getNwlVaultTotalAllocationPoints = async ({
  nwlVaultContract,
  tokenAddress
}: GetNwlVaultTotalAllocPointsInput): Promise<GetNwlVaultTotalAllocPointsOutput> => {
  const res = await nwlVaultContract.methods.totalAllocPoints(tokenAddress).call()

  return {
    totalAllocationPoints: +res
  }
}

export default getNwlVaultTotalAllocationPoints
