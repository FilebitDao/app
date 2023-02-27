import { MutationObserverOptions, useMutation } from 'react-query'

import {
  StakeInNwlVaultInput,
  StakeInNwlVaultOutput,
  queryClient,
  stakeInNwlVault
} from 'clients/api'
import { useNwlVaultProxyContract } from 'clients/contracts/hooks'

import FunctionKey from 'constants/functionKey'
import { TOKENS } from 'constants/tokens'

import { getContractAddress, unsafelyGetToken } from 'utilities'

const NWL_VAULT_PROXY_CONTRACT_ADDRESS = getContractAddress('nwlVaultProxy')

type Options = MutationObserverOptions<
  StakeInNwlVaultOutput,
  Error,
  Omit<StakeInNwlVaultInput, 'nwlVaultContract'>
>

const useStakeInNwlVault = ({ stakedTokenId }: { stakedTokenId: string }, options?: Options) => {
  const nwlVaultContract = useNwlVaultProxyContract()

  return useMutation(
    FunctionKey.STAKE_IN_NWL_VAULT,
    (params: Omit<StakeInNwlVaultInput, 'nwlVaultContract'>) =>
      stakeInNwlVault({
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
            accountAddress: NWL_VAULT_PROXY_CONTRACT_ADDRESS,
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

export default useStakeInNwlVault
