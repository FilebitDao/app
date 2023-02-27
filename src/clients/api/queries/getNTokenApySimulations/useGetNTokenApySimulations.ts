import { QueryObserverOptions, useQuery } from 'react-query'

import BigNumber from 'bignumber.js'

import useGetNTokenInterestRateModel from 'clients/api/queries/getNTokenInterestRateModel/useGetNTokenInterestRateModel'
import { useMulticall } from 'clients/web3'

import FunctionKey from 'constants/functionKey'

import { GetNTokenApySimulationsOutput } from './types'

import getNTokenApySimulations from './getNTokenApySimulations'

type Options = QueryObserverOptions<
  GetNTokenApySimulationsOutput,
  Error,
  GetNTokenApySimulationsOutput,
  GetNTokenApySimulationsOutput,
  [FunctionKey.GET_N_TOKEN_APY_SIMULATIONS, string]
>

const useGetNTokenApySimulations = (
  { nTokenId, reserveFactorMantissa }: { nTokenId: string; reserveFactorMantissa?: BigNumber },
  options?: Options
) => {
  const multicall = useMulticall()
  const { data: interestRateModelData } = useGetNTokenInterestRateModel({ nTokenId })

  return useQuery(
    [FunctionKey.GET_N_TOKEN_APY_SIMULATIONS, nTokenId],
    () =>
      getNTokenApySimulations({
        multicall,
        reserveFactorMantissa: reserveFactorMantissa || new BigNumber(0),
        interestRateModelContractAddress: interestRateModelData?.contractAddress || ''
      }),
    {
      ...options,
      enabled:
        (options?.enabled === undefined || options?.enabled) &&
        interestRateModelData?.contractAddress !== undefined &&
        reserveFactorMantissa !== undefined
    }
  )
}

export default useGetNTokenApySimulations
