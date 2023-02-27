import { QueryObserverOptions, useQuery } from 'react-query'

import { useNarwhalLensContract } from 'clients/contracts/hooks'

import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval'
import FunctionKey from 'constants/functionKey'

import getNwlReward, { GetNwlRewardInput, GetNwlRewardOutput } from '.'

type Options = QueryObserverOptions<
  GetNwlRewardOutput,
  Error,
  GetNwlRewardOutput,
  GetNwlRewardOutput,
  [FunctionKey.GET_NWL_REWARD, string]
>

const useGetNwlReward = (
  { accountAddress }: Omit<GetNwlRewardInput, 'lensContract'>,
  options?: Options
) => {
  const lensContract = useNarwhalLensContract()

  return useQuery(
    [FunctionKey.GET_NWL_REWARD, accountAddress],
    () =>
      getNwlReward({
        lensContract,
        accountAddress
      }),
    {
      refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
      ...options
    }
  )
}

export default useGetNwlReward
