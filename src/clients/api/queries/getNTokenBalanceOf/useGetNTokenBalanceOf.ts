import { QueryObserverOptions, useQuery } from 'react-query'

import getNTokenBalanceOf, {
  GetNTokenBalanceOfInput,
  GetNTokenBalanceOfOutput
} from 'clients/api/queries/getNTokenBalanceOf'
import { useNTokenContract } from 'clients/contracts/hooks'

import FunctionKey from 'constants/functionKey'

interface TrimmedParams extends Omit<GetNTokenBalanceOfInput, 'nTokenContract'> {
  nTokenId: string
}

type Options = QueryObserverOptions<
  GetNTokenBalanceOfOutput,
  Error,
  GetNTokenBalanceOfOutput,
  GetNTokenBalanceOfOutput,
  [FunctionKey.GET_N_TOKEN_BALANCE, TrimmedParams]
>

const useGetNTokenBalanceOf = ({ accountAddress, nTokenId }: TrimmedParams, options?: Options) => {
  const nTokenContract = useNTokenContract(nTokenId)

  return useQuery(
    [FunctionKey.GET_N_TOKEN_BALANCE, { accountAddress, nTokenId }],
    () => getNTokenBalanceOf({ nTokenContract, accountAddress }),
    options
  )
}

export default useGetNTokenBalanceOf
