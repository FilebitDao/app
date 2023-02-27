import BigNumber from 'bignumber.js'

import { NwlVault } from 'types/contracts'

export interface GetCurrentVotesInput {
  nwlVaultContract: NwlVault
  accountAddress: string
}

export type GetCurrentVotesOutput = {
  votesWei: BigNumber
}

const getCurrentVotes = async ({
  nwlVaultContract,
  accountAddress
}: GetCurrentVotesInput): Promise<GetCurrentVotesOutput> => {
  const resp = await nwlVaultContract.methods.getCurrentVotes(accountAddress).call()

  return {
    votesWei: new BigNumber(resp)
  }
}

export default getCurrentVotes
