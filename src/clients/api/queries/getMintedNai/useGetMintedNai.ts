import { QueryObserverOptions, useQuery } from 'react-query'

import getMintedNai, {
  GetMintedNaiInput,
  GetMintedNaiOutput
} from 'clients/api/queries/getMintedNai'
import { useComptrollerContract } from 'clients/contracts/hooks'

import FunctionKey from 'constants/functionKey'

type Options = QueryObserverOptions<
  GetMintedNaiOutput,
  Error,
  GetMintedNaiOutput,
  GetMintedNaiOutput,
  FunctionKey.GET_MINTED_NAI
>

const useGetMintedNai = (
  { accountAddress }: Omit<GetMintedNaiInput, 'comptrollerContract'>,
  options?: Options
) => {
  const comptrollerContract = useComptrollerContract()

  return useQuery(
    FunctionKey.GET_MINTED_NAI,
    () => getMintedNai({ accountAddress, comptrollerContract }),
    options
  )
}

export default useGetMintedNai
