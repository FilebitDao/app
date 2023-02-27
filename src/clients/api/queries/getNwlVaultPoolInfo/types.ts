import BigNumber from 'bignumber.js'

import { NwlVault } from 'types/contracts'

export interface GetNwlVaultPoolInfoInput {
  nwlVaultContract: NwlVault
  rewardTokenAddress: string
  poolIndex: number
}

export interface GetNwlVaultPoolInfoOutput {
  stakedTokenAddress: string
  allocationPoint: number
  lastRewardBlock: number
  accRewardPerShare: BigNumber
  lockingPeriodMs: number
}
