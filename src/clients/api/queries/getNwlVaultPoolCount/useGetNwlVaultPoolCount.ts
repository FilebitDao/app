import { QueryObserverOptions, useQuery } from 'react-query'

import getNwlVaultPoolCount, {
  GetNwlVaultPoolCountOutput
} from 'clients/api/queries/getNwlVaultPoolCount'
import { useNwlVaultProxyContract } from 'clients/contracts/hooks'

import FunctionKey from 'constants/functionKey'

type Options = QueryObserverOptions<
  GetNwlVaultPoolCountOutput,
  Error,
  GetNwlVaultPoolCountOutput,
  GetNwlVaultPoolCountOutput,
  FunctionKey.GET_NWL_VAULT_POOLS_COUNT
>

const useGetNwlVaultPoolCount = (options?: Options) => {
  const nwlVaultContract = useNwlVaultProxyContract()

  return useQuery(
    FunctionKey.GET_NWL_VAULT_POOLS_COUNT,
    () => getNwlVaultPoolCount({ nwlVaultContract }),
    options
  )
}

export default useGetNwlVaultPoolCount
