import { QueryObserverOptions, useQuery } from 'react-query'

import {
  GetVoteDelegateAddressInput,
  GetVoteDelegateAddressOutput,
  getVoteDelegateAddress
} from 'clients/api'
import { useNwlVaultProxyContract } from 'clients/contracts/hooks'

import FunctionKey from 'constants/functionKey'

type Options = QueryObserverOptions<
  GetVoteDelegateAddressOutput,
  Error,
  GetVoteDelegateAddressOutput,
  GetVoteDelegateAddressOutput,
  [FunctionKey.GET_VOTE_DELEGATE_ADDRESS, Omit<GetVoteDelegateAddressInput, 'nwlVaultContract'>]
>

const useGetVoteDelegateAddress = (
  { accountAddress }: Omit<GetVoteDelegateAddressInput, 'nwlVaultContract'>,
  options?: Options
) => {
  const nwlVaultContract = useNwlVaultProxyContract()

  return useQuery(
    [FunctionKey.GET_VOTE_DELEGATE_ADDRESS, { accountAddress }],
    () => getVoteDelegateAddress({ nwlVaultContract, accountAddress }),
    options
  )
}

export default useGetVoteDelegateAddress
