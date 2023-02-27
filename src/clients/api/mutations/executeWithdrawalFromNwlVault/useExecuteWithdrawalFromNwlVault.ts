import { MutationObserverOptions, useMutation } from 'react-query'

import {
  ExecuteWithdrawalFromNwlVaultInput,
  ExecuteWithdrawalFromNwlVaultOutput,
  executeWithdrawalFromNwlVault,
  queryClient
} from 'clients/api'
import { useNwlVaultProxyContract } from 'clients/contracts/hooks'

import FunctionKey from 'constants/functionKey'
import { TOKENS } from 'constants/tokens'

import { getContractAddress, unsafelyGetToken } from 'utilities'

const XVS_VAULT_PROXY_CONTRACT_ADDRESS = getContractAddress('nwlVaultProxy')

type Options = MutationObserverOptions<
  ExecuteWithdrawalFromNwlVaultOutput,
  Error,
  Omit<ExecuteWithdrawalFromNwlVaultInput, 'nwlVaultContract'>
>

const useExecuteWithdrawalFromNwlVault = (
  { stakedTokenId }: { stakedTokenId: string },
  options?: Options
) => {
  const nwlVaultContract = useNwlVaultProxyContract()

  return useMutation(
    FunctionKey.REQUEST_WITHDRAWAL_FROM_NWL_VAULT,
    (params: Omit<ExecuteWithdrawalFromNwlVaultInput, 'nwlVaultContract'>) =>
      executeWithdrawalFromNwlVault({
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
          {
            rewardTokenAddress: TOKENS.nwl.address,
            poolIndex,
            accountAddress: fromAccountAddress
          }
        ])

        const stakedToken = unsafelyGetToken(stakedTokenId)

        // Invalidate cached user balance
        queryClient.invalidateQueries([
          FunctionKey.GET_BALANCE_OF,
          {
            accountAddress: fromAccountAddress,
            tokenAddress: stakedToken.address
          }
        ])

        // Invalidate cached vault data
        queryClient.invalidateQueries([
          FunctionKey.GET_BALANCE_OF,
          {
            accountAddress: XVS_VAULT_PROXY_CONTRACT_ADDRESS,
            tokenAddress: stakedToken.address
          }
        ])

        queryClient.invalidateQueries([
          FunctionKey.GET_NWL_VAULT_POOL_INFOS,
          { rewardTokenAddress: TOKENS.nwl.address, poolIndex }
        ])

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams)
        }
      }
    }
  )
}

export default useExecuteWithdrawalFromNwlVault
