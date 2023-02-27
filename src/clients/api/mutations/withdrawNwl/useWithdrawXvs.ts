import { MutationObserverOptions, useMutation } from 'react-query'

import { WithdrawNwlInput, WithdrawNwlOutput, withdrawNwl } from 'clients/api'
import queryClient from 'clients/api/queryClient'
import { useNwlVestingProxyContract } from 'clients/contracts/hooks'

import FunctionKey from 'constants/functionKey'

const useWithdrawXvs = (
  options?: MutationObserverOptions<
    WithdrawNwlOutput,
    Error,
    Omit<WithdrawNwlInput, 'nwlVestingContract'>
  >
) => {
  const nwlVestingContract = useNwlVestingProxyContract()

  return useMutation(
    FunctionKey.WITHDRAW_NWL,
    params =>
      withdrawNwl({
        nwlVestingContract,
        ...params
      }),
    {
      ...options,
      onSuccess: (...onSuccessParams) => {
        queryClient.invalidateQueries(FunctionKey.GET_NWL_WITHDRAWABLE_AMOUNT)

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams)
        }
      }
    }
  )
}

export default useWithdrawXvs
