import { LockedDeposit } from 'types'
import { NwlVault } from 'types/contracts'

export interface GetNwlVaultLockedDepositsInput {
  nwlVaultContract: NwlVault
  rewardTokenAddress: string
  poolIndex: number
  accountAddress: string
}

export type GetNwlVaultLockedDepositsOutput = {
  lockedDeposits: LockedDeposit[]
}
