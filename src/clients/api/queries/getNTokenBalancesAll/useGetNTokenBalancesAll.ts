import { QueryObserverOptions, useQuery } from 'react-query'

import getNTokenBalancesAll, {
  GetNTokenBalancesAllInput,
  IGetNTokenBalancesAllOutput
} from 'clients/api/queries/getNTokenBalancesAll'
import { useNarwhalLensContract } from 'clients/contracts/hooks'

import FunctionKey from 'constants/functionKey'

type Options = QueryObserverOptions<
  IGetNTokenBalancesAllOutput,
  Error,
  IGetNTokenBalancesAllOutput,
  IGetNTokenBalancesAllOutput,
  [FunctionKey.GET_N_TOKEN_BALANCES_ALL, Omit<GetNTokenBalancesAllInput, 'narwhalLensContract'>]
>

const useGetNTokenBalancesAll = (
  { account, nTokenAddresses }: Omit<GetNTokenBalancesAllInput, 'narwhalLensContract'>,
  options?: Options
) => {
  const narwhalLensContract = useNarwhalLensContract()
  return useQuery(
    [FunctionKey.GET_N_TOKEN_BALANCES_ALL, { account, nTokenAddresses }],
    () => getNTokenBalancesAll({ narwhalLensContract, account, nTokenAddresses }),
    options
  )
}

export default useGetNTokenBalancesAll
