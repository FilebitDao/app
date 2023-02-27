import { MutationObserverOptions, useMutation } from 'react-query'

import {
  WithdrawFromNaiVaultInput,
  WithdrawFromNaiVaultOutput,
  queryClient,
  withdrawFromNaiVault
} from 'clients/api'
import { useNaiVaultContract } from 'clients/contracts/hooks'

import FunctionKey from 'constants/functionKey'
import { TOKENS } from 'constants/tokens'

import { getContractAddress } from 'utilities'

const NAI_VAULT_ADDRESS = getContractAddress('naiVault')

type Options = MutationObserverOptions<
  WithdrawFromNaiVaultOutput,
  Error,
  Omit<WithdrawFromNaiVaultInput, 'naiVaultContract'>
>

const useWithdrawFromNaiVault = (options?: Options) => {
  const naiVaultContract = useNaiVaultContract()

  return useMutation(
    FunctionKey.WITHDRAW_FROM_NAI_VAULT,
    (params: Omit<WithdrawFromNaiVaultInput, 'naiVaultContract'>) =>
      withdrawFromNaiVault({
        naiVaultContract,
        ...params
      }),
    {
      ...options,
      onSuccess: async (...onSuccessParams) => {
        const { fromAccountAddress } = onSuccessParams[1]

        // Invalidate cached user info, including staked amount
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
            accountAddress: NAI_VAULT_ADDRESS,
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

export default useWithdrawFromNaiVault
