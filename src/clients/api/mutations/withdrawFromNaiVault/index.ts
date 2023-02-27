import BigNumber from 'bignumber.js'

import { checkForNaiVaultTransactionError } from 'errors'

import { NaiVault } from 'types/contracts'
import type { TransactionReceipt } from 'web3-core/types'

export interface WithdrawFromNaiVaultInput {
  naiVaultContract: NaiVault
  fromAccountAddress: string
  amountWei: BigNumber
}

export type WithdrawFromNaiVaultOutput = TransactionReceipt

const withdrawFromNaiVault = async ({
  naiVaultContract,
  fromAccountAddress,
  amountWei
}: WithdrawFromNaiVaultInput): Promise<WithdrawFromNaiVaultOutput> => {
  const res = await naiVaultContract.methods
    .withdraw(amountWei.toFixed())
    .send({ from: fromAccountAddress })

  return checkForNaiVaultTransactionError(res)
}

export default withdrawFromNaiVault
