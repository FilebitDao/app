import BigNumber from 'bignumber.js'

import { checkForNwlVaultProxyTransactionError } from 'errors'

import { NwlVault } from 'types/contracts'
import type { TransactionReceipt } from 'web3-core/types'

export interface RequestWithdrawalFromNwlVaultInput {
  nwlVaultContract: NwlVault
  fromAccountAddress: string
  rewardTokenAddress: string
  poolIndex: number
  amountWei: BigNumber
}

export type RequestWithdrawalFromNwlVaultOutput = TransactionReceipt

const requestWithdrawalFromNwlVault = async ({
  nwlVaultContract,
  fromAccountAddress,
  rewardTokenAddress,
  poolIndex,
  amountWei
}: RequestWithdrawalFromNwlVaultInput): Promise<RequestWithdrawalFromNwlVaultOutput> => {
  const res = await nwlVaultContract.methods
    .requestWithdrawal(rewardTokenAddress, poolIndex, amountWei.toFixed())
    .send({ from: fromAccountAddress })

  return checkForNwlVaultProxyTransactionError(res)
}

export default requestWithdrawalFromNwlVault
