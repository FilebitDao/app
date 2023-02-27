import BigNumber from 'bignumber.js'

import { NaiVault } from 'types/contracts'

export interface GetNaiVaultPendingNwlInput {
  naiVaultContract: NaiVault
  accountAddress: string
}

export type GetNaiVaultPendingNwlOutput = {
  pendingNWLWei: BigNumber
}

const getVaiVaultPendingNwl = async ({
  naiVaultContract,
  accountAddress
}: GetNaiVaultPendingNwlInput): Promise<GetNaiVaultPendingNwlOutput> => {
  const res = await naiVaultContract.methods.pendingNWL(accountAddress).call()

  return {
    pendingNWLWei: new BigNumber(res)
  }
}

export default getVaiVaultPendingNwl
