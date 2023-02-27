import BigNumber from 'bignumber.js'

import { NaiUnitroller } from 'types/contracts'

export interface GetNaiTreasuryPercentageInput {
  naiControllerContract: NaiUnitroller
}

export type GetNaiTreasuryPercentageOutput = {
  percentage: number
}

const getNaiTreasuryPercentage = async ({
  naiControllerContract
}: GetNaiTreasuryPercentageInput): Promise<GetNaiTreasuryPercentageOutput> => {
  const treasuryPercentage = await naiControllerContract.methods.treasuryPercent().call()
  const formattedTreasuryPercentage = new BigNumber(treasuryPercentage)
    .times(100)
    .div(1e18)
    .toNumber()

  return {
    percentage: formattedTreasuryPercentage
  }
}

export default getNaiTreasuryPercentage
