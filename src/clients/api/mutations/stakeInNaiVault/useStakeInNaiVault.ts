import { MutationObserverOptions, useMutation } from 'react-query'

import {
  StakeInNaiVaultInput,
  StakeInNaiVaultOutput,
  queryClient,
  stakeInNaiVault
} from 'clients/api'
import { useNaiVaultContract } from 'clients/contracts/hooks'

import FunctionKey from 'constants/functionKey'
import { TOKENS } from 'constants/tokens'

import { getContractAddress } from 'utilities'

type Options = MutationObserverOptions<
  StakeInNaiVaultOutput,
  Error,
  Omit<StakeInNaiVaultInput, 'naiVaultContract'>
>

const useStakeInNaiVault = (options?: Options) => {
  const naiVaultContract = useNaiVaultContract()

  return useMutation(
    FunctionKey.STAKE_IN_NAI_VAULT,
    (params: Omit<StakeInNaiVaultInput, 'naiVaultContract'>) =>
      stakeInNaiVault({
        naiVaultContract,
        ...params
      }),
    {
      ...options,
      onSuccess: async (...onSuccessParams) => {
        const { fromAccountAddress } = onSuccessParams[1]

        // Invalidate cached user info, including pending reward
        queryClient.invalidateQueries([FunctionKey.GET_NAI_VAULT_USER_INFO, fromAccountAddress])

        // Invalidate cached user balance
        queryClient.invalidateQueries([
          FunctionKey.GET_BALANCE_OF,
          {
            accountAddress: fromAccountAddress,
            tokenAddress: TOKENS.nai.address
          }
        ])

        // Invalidate cached vault data
        queryClient.invalidateQueries([
          FunctionKey.GET_BALANCE_OF,
          {
            accountAddress: getContractAddress('naiVault'),
            tokenAddress: TOKENS.nai.address
          }
        ])

        queryClient.invalidateQueries(FunctionKey.GET_NARWHAL_NAI_VAULT_DAILY_RATE)

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams)
        }
      }
    }
  )
}

export default useStakeInNaiVault
