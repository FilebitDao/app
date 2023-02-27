import { MutationObserverOptions, useMutation } from 'react-query'

import {
  RepayNativeTokenOutput,
  RepayNonNativeNTokenInput,
  queryClient,
  repayNonNativeNToken
} from 'clients/api'
import { useNTokenContract } from 'clients/contracts/hooks'

import FunctionKey from 'constants/functionKey'

type Options = MutationObserverOptions<
  RepayNativeTokenOutput,
  Error,
  Omit<RepayNonNativeNTokenInput, 'nTokenContract'>
>

const useRepayNonNativeNToken = (
  { nTokenId }: { nTokenId: Exclude<string, 'bnb'> },
  options?: Options
) => {
  const nTokenContract = useNTokenContract(nTokenId)

  return useMutation(
    FunctionKey.REPAY_NON_BNB_N_TOKEN,
    params =>
      repayNonNativeNToken({
        nTokenContract,
        ...params
      }),
    {
      ...options,
      onSuccess: (...onSuccessParams) => {
        const { fromAccountAddress } = onSuccessParams[1]

        queryClient.invalidateQueries(FunctionKey.GET_N_TOKEN_BALANCES_ALL)
        queryClient.invalidateQueries(FunctionKey.GET_MARKETS)
        queryClient.invalidateQueries([
          FunctionKey.GET_N_TOKEN_BORROW_BALANCE,
          { accountAddress: fromAccountAddress, nTokenId }
        ])

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams)
        }
      }
    }
  )
}

export default useRepayNonNativeNToken
