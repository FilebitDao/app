import { QueryObserverOptions, useQuery } from 'react-query'

import getNwlVaultUserInfo, {
  GetNwlVaultUserInfoInput,
  GetNwlVaultUserInfoOutput
} from 'clients/api/queries/getNwlVaultUserInfo'
import { useNwlVaultProxyContract } from 'clients/contracts/hooks'

import FunctionKey from 'constants/functionKey'

type Options = QueryObserverOptions<
  GetNwlVaultUserInfoOutput,
  Error,
  GetNwlVaultUserInfoOutput,
  GetNwlVaultUserInfoOutput,
  [FunctionKey.GET_NWL_VAULT_USER_INFO, Omit<GetNwlVaultUserInfoInput, 'nwlVaultContract'>]
>

const useGetNwlVaultUserInfo = (
  params: Omit<GetNwlVaultUserInfoInput, 'nwlVaultContract'>,
  options?: Options
) => {
  const nwlVaultContract = useNwlVaultProxyContract()

  return useQuery(
    [FunctionKey.GET_NWL_VAULT_USER_INFO, params],
    () => getNwlVaultUserInfo({ nwlVaultContract, ...params }),
    options
  )
}

export default useGetNwlVaultUserInfo
