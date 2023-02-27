import { QueryObserverOptions, useQuery } from 'react-query'

import { getNwlVaultLockedDeposits } from 'clients/api'
import {
  GetNwlVaultLockedDepositsInput,
  GetNwlVaultLockedDepositsOutput
} from 'clients/api/queries/getNwlVaultLockedDeposits/types'
import { useNwlVaultProxyContract } from 'clients/contracts/hooks'

import FunctionKey from 'constants/functionKey'

type Options = QueryObserverOptions<
  GetNwlVaultLockedDepositsOutput,
  Error,
  GetNwlVaultLockedDepositsOutput,
  GetNwlVaultLockedDepositsOutput,
  [
    FunctionKey.GET_NWL_VAULT_WITHDRAWAL_REQUESTS,
    Omit<GetNwlVaultLockedDepositsInput, 'nwlVaultContract'>
  ]
>

const useGetNwlVaultLockedDeposits = (
  params: Omit<GetNwlVaultLockedDepositsInput, 'nwlVaultContract'>,
  options?: Options
) => {
  const nwlVaultContract = useNwlVaultProxyContract()

  return useQuery(
    [FunctionKey.GET_NWL_VAULT_WITHDRAWAL_REQUESTS, params],
    () => getNwlVaultLockedDeposits({ nwlVaultContract, ...params }),
    options
  )
}

export default useGetNwlVaultLockedDeposits
