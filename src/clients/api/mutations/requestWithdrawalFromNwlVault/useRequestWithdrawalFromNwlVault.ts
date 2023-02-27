import { MutationObserverOptions, useMutation } from 'react-query'

import {
  RequestWithdrawalFromNwlVaultInput,
  RequestWithdrawalFromNwlVaultOutput,
  queryClient,
  requestWithdrawalFromNwlVault
} from 'clients/api'
import { useNwlVaultProxyContract } from 'clients/contracts/hooks'

import FunctionKey from 'constants/functionKey'
import { TOKENS } from 'constants/tokens'

type Options = MutationObserverOptions<
  RequestWithdrawalFromNwlVaultOutput,
  Error,
  Omit<RequestWithdrawalFromNwlVaultInput, 'nwlVaultContract'>
>

const useRequestWithdrawalFromNwlVault = (options?: Options) => {
  const nwlVaultContract = useNwlVaultProxyContract()

  return useMutation(
    FunctionKey.REQUEST_WITHDRAWAL_FROM_NWL_VAULT,
    (params: Omit<RequestWithdrawalFromNwlVaultInput, 'nwlVaultContract'>) =>
      requestWithdrawalFromNwlVault({
        nwlVaultContract,
        ...params
      }),
    {
      ...options,
      onSuccess: async (...onSuccessParams) => {
        const { fromAccountAddress, poolIndex } = onSuccessParams[1]

        // Invalidate cached user info
        queryClient.invalidateQueries([
          FunctionKey.GET_NWL_VAULT_USER_INFO,
          { accountAddress: fromAccountAddress, rewardTokenAddress: TOKENS.nwl.address, poolIndex }
        ])

        // Invalidate cached user pending reward
        queryClient.invalidateQueries([
          FunctionKey.GET_NWL_VAULT_PENDING_REWARD,
          { accountAddress: fromAccountAddress, rewardTokenAddress: TOKENS.nwl.address, poolIndex }
        ])

        // Invalidate cached user withdrawal requests
        queryClient.invalidateQueries([
          FunctionKey.GET_NWL_VAULT_WITHDRAWAL_REQUESTS,
          { accountAddress: fromAccountAddress, rewardTokenAddress: TOKENS.nwl.address, poolIndex }
        ])

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams)
        }
      }
    }
  )
}

export default useRequestWithdrawalFromNwlVault
