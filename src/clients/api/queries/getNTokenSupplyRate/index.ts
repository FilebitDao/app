import BigNumber from 'bignumber.js'

import { InterestModel } from 'types/contracts'

export interface GetNTokenSupplyRateInput {
  interestModelContract: InterestModel
  cashAmountWei: BigNumber
  borrowsAmountWei: BigNumber
  reservesAmountWei: BigNumber
  reserveFactorMantissa: BigNumber
}

export type IGetNTokenSupplyRateOutput = {
  supplyRateWei: BigNumber
}

const getNTokenSupplyRate = async ({
  interestModelContract,
  cashAmountWei,
  borrowsAmountWei,
  reservesAmountWei,
  reserveFactorMantissa
}: GetNTokenSupplyRateInput): Promise<IGetNTokenSupplyRateOutput> => {
  const res = await interestModelContract.methods
    .getSupplyRate(
      cashAmountWei.toFixed(),
      borrowsAmountWei.toFixed(),
      reservesAmountWei.toFixed(),
      reserveFactorMantissa.toFixed()
    )
    .call()

  return {
    supplyRateWei: new BigNumber(res)
  }
}
export default getNTokenSupplyRate
