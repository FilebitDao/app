import { MutationObserverOptions, useMutation } from 'react-query'

import { ApproveTokenInput, ApproveTokenOutput, approveToken, queryClient } from 'clients/api'
import { useTokenContract } from 'clients/contracts/hooks'

import FunctionKey from 'constants/functionKey'

import { Token } from 'types'

import setCachedTokenAllowanceToMax from '../../queries/getAllowance/setCachedTokenAllowanceToMax'

const useApproveToken = (
  { token }: { token: Token },
  options?: MutationObserverOptions<
    ApproveTokenOutput,
    Error,
    Omit<ApproveTokenInput, 'tokenContract'>
  >
) => {
  const tokenContract = useTokenContract(token)

  return useMutation(
    [FunctionKey.APPROVE_TOKEN, { token }],
    params =>
      approveToken({
        tokenContract,
        ...params
      }),
    {
      ...options,
      onSuccess: (...onSuccessParams) => {
        const { spenderAddress, accountAddress } = onSuccessParams[1]
        setCachedTokenAllowanceToMax({ queryClient, token, spenderAddress, accountAddress })

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams)
        }
      }
    }
  )
}

export default useApproveToken
