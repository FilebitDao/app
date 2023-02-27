import { QueryObserverOptions, useQuery } from 'react-query'

import getNwlVaultRewardPerBlock, {
  GetNwlVaultRewardPerBlockInput,
  GetNwlVaultRewardPerBlockOutput
} from 'clients/api/queries/getNwlVaultRewardPerBlock'
import { useNwlVaultProxyContract } from 'clients/contracts/hooks'

import FunctionKey from 'constants/functionKey'

type Options = QueryObserverOptions<
  GetNwlVaultRewardPerBlockOutput,
  Error,
  GetNwlVaultRewardPerBlockOutput,
  GetNwlVaultRewardPerBlockOutput,
  [FunctionKey.GET_NWL_VAULT_REWARD_PER_BLOCK, string]
>

const useGetNwlVaultRewardPerBlock = (
  { tokenAddress }: Omit<GetNwlVaultRewardPerBlockInput, 'nwlVaultContract'>,
  options?: Options
) => {
  const nwlVaultContract = useNwlVaultProxyContract()

  return useQuery(
    [FunctionKey.GET_NWL_VAULT_REWARD_PER_BLOCK, tokenAddress],
    () => getNwlVaultRewardPerBlock({ tokenAddress, nwlVaultContract }),
    options
  )
}

export default useGetNwlVaultRewardPerBlock
