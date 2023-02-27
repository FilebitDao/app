import { MutationObserverOptions, useMutation } from 'react-query'

import redeem, { RedeemInput, RedeemOutput } from 'clients/api/mutations/redeem'
import queryClient from 'clients/api/queryClient'
import { useNTokenContract } from 'clients/contracts/hooks'

import FunctionKey from 'constants/functionKey'

import { NFrc20 } from 'types/contracts'

const useRedeem = (
  { nTokenId, accountAddress }: { nTokenId: string; accountAddress: string },
  // TODO: use custom error type https://app.clickup.com/t/2rvwhnt
  options?: MutationObserverOptions<
    RedeemOutput,
    Error,
    Omit<RedeemInput, 'tokenContract' | 'accountAddress'>
  >
) => {
  const tokenContract = useNTokenContract(nTokenId)

  return useMutation(
    FunctionKey.REDEEM,
    params =>
      redeem({
        tokenContract: tokenContract as NFrc20,
        accountAddress,
        ...params
      }),
    {
      ...options,
      onSuccess: (...onSuccessParams) => {
        queryClient.invalidateQueries(FunctionKey.GET_N_TOKEN_BALANCES_ALL)
        queryClient.invalidateQueries([
          FunctionKey.GET_N_TOKEN_BALANCE,
          {
            accountAddress,
            nTokenId
          }
        ])
        queryClient.invalidateQueries(FunctionKey.GET_ASSETS_IN_ACCOUNT)
        queryClient.invalidateQueries(FunctionKey.GET_MARKETS)
        queryClient.invalidateQueries(FunctionKey.GET_N_TOKEN_DAILY_NWL)

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams)
        }
      }
    }
  )
}

export default useRedeem
