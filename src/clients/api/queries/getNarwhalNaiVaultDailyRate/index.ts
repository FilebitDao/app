import BigNumber from 'bignumber.js'

import { BLOCKS_PER_DAY } from 'constants/bsc'

import { Comptroller } from 'types/contracts'

export interface GetNarwhalNaiVaultDailyRateInput {
  comptrollerContract: Comptroller
}

export type GetNarwhalNaiVaultDailyRateOutput = {
  dailyRateWei: BigNumber
}

const getNarwhalVaiVaultDailyRate = async ({
  comptrollerContract
}: GetNarwhalNaiVaultDailyRateInput): Promise<GetNarwhalNaiVaultDailyRateOutput> => {
  const resp = await comptrollerContract.methods.narwhalNAIVaultRate().call()

  return {
    dailyRateWei: new BigNumber(resp).times(BLOCKS_PER_DAY)
  }
}

export default getNarwhalVaiVaultDailyRate
