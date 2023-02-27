import BigNumber from 'bignumber.js'

import { NaiVault } from 'types/contracts'

export interface GetNaiVaultUserInfoInput {
  naiVaultContract: NaiVault
  accountAddress: string
}

export interface GetNaiVaultUserInfoOutput {
  stakedNaiWei: BigNumber
}
