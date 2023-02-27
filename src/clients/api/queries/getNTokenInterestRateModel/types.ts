import { NFilToken, NFrc20 } from 'types/contracts'

export interface GetNTokenInterestRateModelInput {
  nTokenContract: NFrc20 | NFilToken
}

export type GetNTokenInterestRateModelOutput = {
  contractAddress: string
}
