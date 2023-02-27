import BigNumber from 'bignumber.js'

import { NwlVault } from 'types/contracts'

export interface GetNwlVaultUserInfoInput {
  nwlVaultContract: NwlVault
  rewardTokenAddress: string
  poolIndex: number
  accountAddress: string
}

export interface GetNwlVaultUserInfoOutput {
  stakedAmountWei: BigNumber
  pendingWithdrawalsTotalAmountWei: BigNumber
  rewardDebtAmountWei: BigNumber
}
