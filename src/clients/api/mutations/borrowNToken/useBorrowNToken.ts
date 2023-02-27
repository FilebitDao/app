import { MutationObserverOptions, useMutation } from 'react-query'

import { BorrowNTokenInput, BorrowNTokenOutput, borrowNToken, queryClient } from 'clients/api'
import { useNTokenContract } from 'clients/contracts/hooks'

import FunctionKey from 'constants/functionKey'

type Options = MutationObserverOptions<
  BorrowNTokenOutput,
  Error,
  Omit<BorrowNTokenInput, 'nTokenContract'>
>

const useBorrowNToken = ({ nTokenId }: { nTokenId: string }, options?: Options) => {
  const nTokenContract = useNTokenContract(nTokenId)

  return useMutation(
    FunctionKey.BORROW_N_TOKEN,
    params =>
      borrowNToken({
        nTokenContract,
        ...params
      }),
    {
      ...options,
      onSuccess: (...onSuccessParams) => {
        const { fromAccountAddress } = onSuccessParams[1]

        queryClient.invalidateQueries(FunctionKey.GET_N_TOKEN_BALANCES_ALL)
        queryClient.invalidateQueries([
          FunctionKey.GET_N_TOKEN_BALANCE,
          {
            accountAddress: fromAccountAddress,
            nTokenId
          }
        ])
        queryClient.invalidateQueries(FunctionKey.GET_ASSETS_IN_ACCOUNT)
        queryClient.invalidateQueries(FunctionKey.GET_MARKETS)
        queryClient.invalidateQueries([
          FunctionKey.GET_N_TOKEN_BORROW_BALANCE,
          {
            accountAddress: fromAccountAddress,
            nTokenId
          }
        ])

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams)
        }
      }
    }
  )
}

export default useBorrowNToken
