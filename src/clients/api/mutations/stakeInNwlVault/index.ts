import BigNumber from 'bignumber.js'

import { checkForNwlVaultProxyTransactionError } from 'errors'

import { NwlVault } from 'types/contracts'
import type { TransactionReceipt } from 'web3-core/types'

export interface StakeInNwlVaultInput {
  nwlVaultContract: NwlVault
  fromAccountAddress: string
  rewardTokenAddress: string
  amountWei: BigNumber
  poolIndex: number
}

export type StakeInNwlVaultOutput = TransactionReceipt

const stakeInNwlVault = async ({
  nwlVaultContract,
  fromAccountAddress,
  rewardTokenAddress,
  amountWei,
  poolIndex
}: StakeInNwlVaultInput): Promise<StakeInNwlVaultOutput> => {
  const resp = await nwlVaultContract.methods
    .deposit(rewardTokenAddress, poolIndex, amountWei.toFixed())
    .send({ from: fromAccountAddress })
  return checkForNwlVaultProxyTransactionError(resp)
}

export default stakeInNwlVault
