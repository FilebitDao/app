import { QueryObserverOptions, useQuery } from 'react-query'

import getDailyNwl, { GetDailyXvsInput, IGetDailyXvsOutput } from 'clients/api/queries/getDailyNwl'
import { useNarwhalLensContract } from 'clients/contracts/hooks'

import FunctionKey from 'constants/functionKey'

type Options = QueryObserverOptions<
  IGetDailyXvsOutput,
  Error,
  IGetDailyXvsOutput,
  IGetDailyXvsOutput,
  [FunctionKey.GET_N_TOKEN_DAILY_NWL, Omit<GetDailyXvsInput, 'narwhalLensContract'>]
>

const useGetDailyNwl = (
  params: Omit<GetDailyXvsInput, 'narwhalLensContract'>,
  options?: Options
) => {
  const narwhalLensContract = useNarwhalLensContract()

  return useQuery(
    [FunctionKey.GET_N_TOKEN_DAILY_NWL, params],
    () => getDailyNwl({ accountAddress: params.accountAddress, narwhalLensContract }),
    options
  )
}
export default useGetDailyNwl
