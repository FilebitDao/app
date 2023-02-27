import { QueryObserverOptions, useQuery } from 'react-query'

import getNwlVaultPoolInfo, {
  GetNwlVaultPoolInfoInput,
  GetNwlVaultPoolInfoOutput
} from 'clients/api/queries/getNwlVaultPoolInfo'
import { useNwlVaultProxyContract } from 'clients/contracts/hooks'

import FunctionKey from 'constants/functionKey'

type Options = QueryObserverOptions<
  GetNwlVaultPoolInfoOutput,
  Error,
  GetNwlVaultPoolInfoOutput,
  GetNwlVaultPoolInfoOutput,
  [FunctionKey.GET_NWL_VAULT_POOL_INFOS, Omit<GetNwlVaultPoolInfoInput, 'nwlVaultContract'>]
>

const useGetNwlVaultPoolInfo = (
  params: Omit<GetNwlVaultPoolInfoInput, 'nwlVaultContract'>,
  options?: Options
) => {
  const nwlVaultContract = useNwlVaultProxyContract()

  return useQuery(
    [FunctionKey.GET_NWL_VAULT_POOL_INFOS, params],
    () => getNwlVaultPoolInfo({ nwlVaultContract, ...params }),
    options
  )
}

export default useGetNwlVaultPoolInfo
