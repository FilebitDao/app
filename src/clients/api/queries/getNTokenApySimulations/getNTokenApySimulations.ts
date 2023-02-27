import BigNumber from 'bignumber.js'
import { ContractCallContext, ContractCallResults } from 'ethereum-multicall'

import interestModelAbi from 'constants/contracts/abis/interestModel.json'

import { GetNTokenApySimulationsOutput, GetNTokenInterestRatesInput } from './types'

import formatToApySnapshots from './formatToApySnapshots'

const REFERENCE_AMOUNT_WEI = 1e4

const getNTokenApySimulations = async ({
  multicall,
  reserveFactorMantissa,
  interestRateModelContractAddress
}: GetNTokenInterestRatesInput): Promise<GetNTokenApySimulationsOutput> => {
  const calls: ContractCallContext<$TSFixMe>['calls'] = []

  for (let u = 1; u <= 100; u++) {
    const utilizationRate = u / 100
    const cashAmountWei = new BigNumber(1 / utilizationRate - 1)
      .times(REFERENCE_AMOUNT_WEI)
      .dp(0)
      .toFixed()

    const borrowsAmountWei = new BigNumber(REFERENCE_AMOUNT_WEI).toFixed()
    const reservesAmountWei = new BigNumber(0).toFixed()

    calls.push({
      reference: 'getBorrowRate',
      methodName: 'getBorrowRate',
      methodParameters: [cashAmountWei, borrowsAmountWei, reservesAmountWei]
    })

    calls.push({
      reference: 'getSupplyRate',
      methodName: 'getSupplyRate',
      methodParameters: [
        cashAmountWei,
        borrowsAmountWei,
        reservesAmountWei,
        reserveFactorMantissa.toFixed()
      ]
    })
  }

  const contractCallContext: ContractCallContext = {
    reference: 'getNTokenRates',
    contractAddress: interestRateModelContractAddress,
    abi: interestModelAbi,
    calls
  }

  const nTokenBalanceCallResults: ContractCallResults = await multicall.call(contractCallContext)
  const apySimulations = formatToApySnapshots({ nTokenBalanceCallResults })

  return { apySimulations }
}

export default getNTokenApySimulations
