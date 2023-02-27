import { QueryObserverOptions, useQuery } from 'react-query'

import { GetNarwhalNaiVaultDailyRateOutput, getNarwhalVaiVaultDailyRate } from 'clients/api'
import { useComptrollerContract } from 'clients/contracts/hooks'

import FunctionKey from 'constants/functionKey'

type Options = QueryObserverOptions<
  GetNarwhalNaiVaultDailyRateOutput,
  Error,
  GetNarwhalNaiVaultDailyRateOutput,
  GetNarwhalNaiVaultDailyRateOutput,
  FunctionKey.GET_NARWHAL_NAI_VAULT_DAILY_RATE
>

const useGetNarwhalNaiVaultDailyRate = (options?: Options) => {
  const comptrollerContract = useComptrollerContract()

  return useQuery(
    FunctionKey.GET_NARWHAL_NAI_VAULT_DAILY_RATE,
    () => getNarwhalVaiVaultDailyRate({ comptrollerContract }),
    options
  )
}

export default useGetNarwhalNaiVaultDailyRate
