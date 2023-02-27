import { MutationObserverOptions, useMutation } from 'react-query'

import {
  ClaimNaiVaultRewardInput,
  ClaimNaiVaultRewardOutput,
  claimNaiVaultReward,
  queryClient
} from 'clients/api'
import { useNaiVaultContract } from 'clients/contracts/hooks'

import FunctionKey from 'constants/functionKey'

type Options = MutationObserverOptions<
  ClaimNaiVaultRewardOutput,
  Error,
  Omit<ClaimNaiVaultRewardInput, 'vaiVaultContract'>
>

const useClaimNaiVaultReward = (options?: Options) => {
  const vaiVaultContract = useNaiVaultContract()

  return useMutation(
    FunctionKey.CLAIM_NAI_VAULT_REWARD,
    (params: Omit<ClaimNaiVaultRewardInput, 'vaiVaultContract'>) =>
      claimNaiVaultReward({
        vaiVaultContract,
        ...params
      }),
    {
      ...options,
      onSuccess: async (...onSuccessParams) => {
        queryClient.invalidateQueries(FunctionKey.GET_NAI_VAULT_PENDING_NWL)

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams)
        }
      }
    }
  )
}

export default useClaimNaiVaultReward
