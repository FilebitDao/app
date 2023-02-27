import { QueryObserverOptions, useQuery } from 'react-query'

import getMintableVai, {
  GetMintableNaiInput,
  GetMintableNaiOutput
} from 'clients/api/queries/getMintableNai'
import { useNaiUnitrollerContract } from 'clients/contracts/hooks'

import FunctionKey from 'constants/functionKey'

type Options = QueryObserverOptions<
  GetMintableNaiOutput,
  Error,
  GetMintableNaiOutput,
  GetMintableNaiOutput,
  [FunctionKey.GET_MINTABLE_NAI, Omit<GetMintableNaiInput, 'naiControllerContract'>]
>

const useGetMintableNai = (
  params: Omit<GetMintableNaiInput, 'naiControllerContract'>,
  options?: Options
) => {
  const naiControllerContract = useNaiUnitrollerContract()

  return useQuery(
    [FunctionKey.GET_MINTABLE_NAI, params],
    () => getMintableVai({ naiControllerContract, ...params }),
    options
  )
}

export default useGetMintableNai
