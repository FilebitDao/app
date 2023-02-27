import { QueryObserverOptions, useQuery } from 'react-query'

import getNwlVaultTotalAllocationPoints, {
  GetNwlVaultTotalAllocPointsInput,
  GetNwlVaultTotalAllocPointsOutput
} from 'clients/api/queries/getNwlVaultTotalAllocationPoints'
import { useNwlVaultProxyContract } from 'clients/contracts/hooks'

import FunctionKey from 'constants/functionKey'

type Options = QueryObserverOptions<
  GetNwlVaultTotalAllocPointsOutput,
  Error,
  GetNwlVaultTotalAllocPointsOutput,
  GetNwlVaultTotalAllocPointsOutput,
  [FunctionKey.GET_NWL_VAULT_TOTAL_ALLOCATION_POINTS, string]
>

const useGetNwlVaultTotalAllocationPoints = (
  { tokenAddress }: Omit<GetNwlVaultTotalAllocPointsInput, 'nwlVaultContract'>,
  options?: Options
) => {
  const nwlVaultContract = useNwlVaultProxyContract()

  return useQuery(
    [FunctionKey.GET_NWL_VAULT_TOTAL_ALLOCATION_POINTS, tokenAddress],
    () => getNwlVaultTotalAllocationPoints({ tokenAddress, nwlVaultContract }),
    options
  )
}

export default useGetNwlVaultTotalAllocationPoints
