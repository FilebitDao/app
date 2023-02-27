import { NULL_ADDRESS } from 'constants/address'

import { NwlVault } from 'types/contracts'

export interface GetVoteDelegateAddressInput {
  nwlVaultContract: NwlVault
  accountAddress: string
}

export type GetVoteDelegateAddressOutput = {
  delegateAddress: string | undefined
}

/**
 *
 * @param address string (valid Ethereum address)
 * @returns Delegated address, if no delegation returns undefined
 */
const getVoteDelegateAddress = async ({
  nwlVaultContract,
  accountAddress
}: GetVoteDelegateAddressInput): Promise<GetVoteDelegateAddressOutput> => {
  const resp = await nwlVaultContract.methods.delegates(accountAddress).call()

  return {
    delegateAddress: resp !== NULL_ADDRESS ? resp : undefined
  }
}

export default getVoteDelegateAddress
