import { MutationObserverOptions, useMutation } from 'react-query'

import { IRepayNaiOutput, RepayNaiInput, queryClient, repayVai } from 'clients/api'
import { useNaiUnitrollerContract } from 'clients/contracts/hooks'

import FunctionKey from 'constants/functionKey'

type Options = MutationObserverOptions<
  IRepayNaiOutput,
  Error,
  Omit<RepayNaiInput, 'naiControllerContract'>
>

const useRepayNai = (options?: Options) => {
  const naiControllerContract = useNaiUnitrollerContract()

  return useMutation(
    FunctionKey.REPAY_NAI,
    (params: Omit<RepayNaiInput, 'naiControllerContract'>) =>
      repayVai({
        naiControllerContract,
        ...params
      }),
    {
      ...options,
      onSuccess: (...onSuccessParams) => {
        // Invalidate queries related to fetching the user minted VAI amount
        queryClient.invalidateQueries(FunctionKey.GET_MINTED_NAI)
        queryClient.invalidateQueries(FunctionKey.GET_N_TOKEN_BALANCES_ALL)

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams)
        }
      }
    }
  )
}

export default useRepayNai
