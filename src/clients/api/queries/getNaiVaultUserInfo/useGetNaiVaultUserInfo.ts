import { QueryObserverOptions, useQuery } from 'react-query'

import {
  GetNaiVaultUserInfoInput,
  GetNaiVaultUserInfoOutput,
  getNaiVaultUserInfo
} from 'clients/api'
import { useNaiVaultContract } from 'clients/contracts/hooks'

import FunctionKey from 'constants/functionKey'

type Options = QueryObserverOptions<
  GetNaiVaultUserInfoOutput,
  Error,
  GetNaiVaultUserInfoOutput,
  GetNaiVaultUserInfoOutput,
  [FunctionKey.GET_NAI_VAULT_USER_INFO, string]
>

const useGetNaiVaultUserInfo = (
  { accountAddress }: Omit<GetNaiVaultUserInfoInput, 'naiVaultContract'>,
  options?: Options
) => {
  const naiVaultContract = useNaiVaultContract()

  return useQuery(
    [FunctionKey.GET_NAI_VAULT_USER_INFO, accountAddress],
    () => getNaiVaultUserInfo({ naiVaultContract, accountAddress }),
    options
  )
}

export default useGetNaiVaultUserInfo
