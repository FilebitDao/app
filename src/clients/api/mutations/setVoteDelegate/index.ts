import type { TransactionReceipt } from 'web3-core'

import { NwlVault } from 'types/contracts'

export interface SetVoteDelegateInput {
  nwlVaultContract: NwlVault
  accountAddress: string
  delegateAddress: string
}

export type SetVoteDelegateOutput = TransactionReceipt

const setVoteDelegate = async ({
  nwlVaultContract,
  accountAddress,
  delegateAddress
}: SetVoteDelegateInput) =>
  nwlVaultContract.methods.delegate(delegateAddress).send({ from: accountAddress })

export default setVoteDelegate
