import { MutationObserverOptions, useMutation } from 'react-query'

import { ClaimNWLRewardInput, ClaimNWLRewardOutput, claimNwlReward, queryClient } from 'clients/api'
import { useComptrollerContract } from 'clients/contracts/hooks'

import FunctionKey from 'constants/functionKey'

type Options = MutationObserverOptions<
  ClaimNWLRewardOutput,
  Error,
  Omit<ClaimNWLRewardInput, 'comptrollerContract' | 'narwhalLensContract'>
>

const useClaimNwlReward = (options?: Options) => {
  const comptrollerContract = useComptrollerContract()

  return useMutation(
    FunctionKey.CLAIM_NWL_REWARD,
    (params: Omit<ClaimNWLRewardInput, 'comptrollerContract' | 'narwhalLensContract'>) =>
      claimNwlReward({
        comptrollerContract,
        ...params
      }),
    {
      ...options,
      onSuccess: async (...onSuccessParams) => {
        queryClient.resetQueries(FunctionKey.GET_NWL_REWARD)

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams)
        }
      }
    }
  )
}

export default useClaimNwlReward
