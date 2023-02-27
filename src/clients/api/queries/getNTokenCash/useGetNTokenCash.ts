import { QueryObserverOptions, useQuery } from 'react-query'

import getNTokenCash, { GetNTokenCashOutput } from 'clients/api/queries/getNTokenCash'
import { useNTokenContract } from 'clients/contracts/hooks'

import FunctionKey from 'constants/functionKey'

type Options = QueryObserverOptions<
  GetNTokenCashOutput,
  Error,
  GetNTokenCashOutput,
  GetNTokenCashOutput,
  [FunctionKey.GET_N_TOKEN_CASH, string]
>

const useGetNTokenCash = ({ nTokenId }: { nTokenId: string }, options?: Options) => {
  const nTokenContract = useNTokenContract(nTokenId)

  return useQuery(
    [FunctionKey.GET_N_TOKEN_CASH, nTokenId],
    () => getNTokenCash({ nTokenContract }),
    options
  )
}

export default useGetNTokenCash
