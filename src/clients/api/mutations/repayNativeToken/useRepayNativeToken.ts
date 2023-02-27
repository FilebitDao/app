import { MutationObserverOptions, useMutation } from 'react-query'

import {
  RepayNativeTokenInput,
  RepayNativeTokenOutput,
  queryClient,
  repayNativeToken
} from 'clients/api'
import { useWeb3 } from 'clients/web3'

import FunctionKey from 'constants/functionKey'
import { TOKENS } from 'constants/tokens'

type Options = MutationObserverOptions<
  RepayNativeTokenOutput,
  Error,
  Omit<RepayNativeTokenInput, 'web3'>
>

const useRepayNativeNToken = (options?: Options) => {
  const web3 = useWeb3()

  return useMutation(
    FunctionKey.REPAY_NATIVE_TOKEN,
    params =>
      repayNativeToken({
        web3,
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
          {
            accountAddress: fromAccountAddress,
            nTokenId: TOKENS.fil.id
          }
        ])

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams)
        }
      }
    }
  )
}

export default useRepayNativeNToken
