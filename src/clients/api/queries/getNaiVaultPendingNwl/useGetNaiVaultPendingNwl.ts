import { QueryObserverOptions, useQuery } from 'react-query'

import {
  GetNaiVaultPendingNwlInput,
  GetNaiVaultPendingNwlOutput,
  getVaiVaultPendingNwl
} from 'clients/api'
import { useNaiVaultContract } from 'clients/contracts/hooks'

import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval'
import FunctionKey from 'constants/functionKey'

type Options = QueryObserverOptions<
  GetNaiVaultPendingNwlOutput,
  Error,
  GetNaiVaultPendingNwlOutput,
  GetNaiVaultPendingNwlOutput,
  [FunctionKey.GET_NAI_VAULT_PENDING_NWL, string]
>

const useGetNaiVaultPendingNwl = (
  { accountAddress }: Omit<GetNaiVaultPendingNwlInput, 'naiVaultContract'>,
  options?: Options
) => {
  const naiVaultContract = useNaiVaultContract()

  return useQuery(
    [FunctionKey.GET_NAI_VAULT_PENDING_NWL, accountAddress],
    () => getVaiVaultPendingNwl({ naiVaultContract, accountAddress }),
    {
      refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
      ...options
    }
  )
}

export default useGetNaiVaultPendingNwl
