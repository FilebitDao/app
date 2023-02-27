import { QueryObserverOptions, useQuery } from 'react-query'

import { getNTokenInterestRateModel } from 'clients/api'
import { useNTokenContract } from 'clients/contracts/hooks'

import FunctionKey from 'constants/functionKey'

import { GetNTokenInterestRateModelOutput } from './types'

type Options = QueryObserverOptions<
  GetNTokenInterestRateModelOutput,
  Error,
  GetNTokenInterestRateModelOutput,
  GetNTokenInterestRateModelOutput,
  [FunctionKey.GET_N_TOKEN_INTEREST_RATE_MODEL, string]
>

const useGetNTokenInterestRateModel = ({ nTokenId }: { nTokenId: string }, options?: Options) => {
  const nTokenContract = useNTokenContract(nTokenId)

  return useQuery(
    [FunctionKey.GET_N_TOKEN_INTEREST_RATE_MODEL, nTokenId],
    () => getNTokenInterestRateModel({ nTokenContract }),
    options
  )
}

export default useGetNTokenInterestRateModel
