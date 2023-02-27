import { QueryObserverOptions, useQuery } from 'react-query'

import { GetNaiTreasuryPercentageOutput, getNaiTreasuryPercentage } from 'clients/api'
import { useNaiUnitrollerContract } from 'clients/contracts/hooks'

import FunctionKey from 'constants/functionKey'

type Options = QueryObserverOptions<
  GetNaiTreasuryPercentageOutput,
  Error,
  GetNaiTreasuryPercentageOutput,
  GetNaiTreasuryPercentageOutput,
  FunctionKey.GET_NAI_TREASURY_PERCENTAGE
>

const useGetNaiTreasuryPercentage = (options?: Options) => {
  const naiControllerContract = useNaiUnitrollerContract()

  return useQuery(
    FunctionKey.GET_NAI_TREASURY_PERCENTAGE,
    () => getNaiTreasuryPercentage({ naiControllerContract }),
    options
  )
}

export default useGetNaiTreasuryPercentage
