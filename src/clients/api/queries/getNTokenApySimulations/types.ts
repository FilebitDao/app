import BigNumber from 'bignumber.js'
import { Multicall } from 'ethereum-multicall'

export interface GetNTokenInterestRatesInput {
  multicall: Multicall
  reserveFactorMantissa: BigNumber
  interestRateModelContractAddress: string
}

export interface NTokenApySnapshot {
  utilizationRate: number
  borrowApyPercentage: number
  supplyApyPercentage: number
}

export type GetNTokenApySimulationsOutput = {
  apySimulations: NTokenApySnapshot[]
}
