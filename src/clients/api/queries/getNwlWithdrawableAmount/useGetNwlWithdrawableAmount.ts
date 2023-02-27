import { QueryObserverOptions, useQuery } from 'react-query'

import getNwlWithdrawableAmount, {
  GetNwlWithdrawableAmountInput,
  GetNwlWithdrawableAmountOutput
} from 'clients/api/queries/getNwlWithdrawableAmount'
import { useNwlVestingProxyContract } from 'clients/contracts/hooks'

import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval'
import FunctionKey from 'constants/functionKey'

type Options = QueryObserverOptions<
  GetNwlWithdrawableAmountOutput,
  Error,
  GetNwlWithdrawableAmountOutput,
  GetNwlWithdrawableAmountOutput,
  FunctionKey.GET_NWL_WITHDRAWABLE_AMOUNT
>

const useGetNwlWithdrawableAmount = (
  { accountAddress }: Omit<GetNwlWithdrawableAmountInput, 'nwlVestingContract'>,
  options?: Options
) => {
  const nwlVestingContract = useNwlVestingProxyContract()

  return useQuery(
    FunctionKey.GET_NWL_WITHDRAWABLE_AMOUNT,
    () => getNwlWithdrawableAmount({ nwlVestingContract, accountAddress }),
    {
      refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
      ...options
    }
  )
}

export default useGetNwlWithdrawableAmount
