import { MutationObserverOptions, useMutation } from 'react-query'

import redeemUnderlying, {
  RedeemUnderlyingInput,
  RedeemUnderlyingOutput
} from 'clients/api/mutations/redeemUnderlying'
import queryClient from 'clients/api/queryClient'
import { useNTokenContract } from 'clients/contracts/hooks'

import FunctionKey from 'constants/functionKey'

const useRedeemUnderlying = (
  { nTokenId, accountAddress }: { nTokenId: string; accountAddress: string },
  // TODO: use custom error type https://app.clickup.com/t/2rvwhnt
  options?: MutationObserverOptions<
    RedeemUnderlyingOutput,
    Error,
    Omit<RedeemUnderlyingInput, 'nTokenContract' | 'accountAddress'>
  >
) => {
  const nTokenContract = useNTokenContract(nTokenId)

  return useMutation(
    FunctionKey.REDEEM_UNDERLYING,
    params =>
      redeemUnderlying({
        nTokenContract,
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

export default useRedeemUnderlying
