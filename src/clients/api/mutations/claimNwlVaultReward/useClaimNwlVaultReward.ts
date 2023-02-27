import { MutationObserverOptions, useMutation } from 'react-query'

import {
  ClaimNwlVaultRewardInput,
  ClaimXvsVaultRewardOutput,
  claimNwlVaultReward,
  queryClient
} from 'clients/api'
import { useNwlVaultProxyContract } from 'clients/contracts/hooks'

import FunctionKey from 'constants/functionKey'
import { TOKENS } from 'constants/tokens'

type Options = MutationObserverOptions<
  ClaimXvsVaultRewardOutput,
  Error,
  Omit<ClaimNwlVaultRewardInput, 'nwlVaultContract'>
>

const useClaimNwlVaultReward = (options?: Options) => {
  const nwlVaultContract = useNwlVaultProxyContract()

  return useMutation(
    FunctionKey.CLAIM_NWL_VAULT_REWARD,
    (params: Omit<ClaimNwlVaultRewardInput, 'nwlVaultContract'>) =>
      claimNwlVaultReward({
        nwlVaultContract,
        ...params
      }),
    {
      ...options,
      onSuccess: async (...onSuccessParams) => {
        const { fromAccountAddress, poolIndex } = onSuccessParams[1]

        queryClient.invalidateQueries([
          FunctionKey.GET_NWL_VAULT_PENDING_REWARD,
          { accountAddress: fromAccountAddress, rewardTokenAddress: TOKENS.nwl.address, poolIndex }
        ])

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams)
        }
      }
    }
  )
}

export default useClaimNwlVaultReward
