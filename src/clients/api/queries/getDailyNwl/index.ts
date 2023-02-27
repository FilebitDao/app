import BigNumber from 'bignumber.js'

import { NarwhalLens } from 'types/contracts'

import { getContractAddress } from 'utilities'

export interface GetDailyXvsInput {
  narwhalLensContract: NarwhalLens
  accountAddress: string
}

export type IGetDailyXvsOutput = {
  dailyNwlWei: BigNumber
}

const comptrollerAddress = getContractAddress('comptroller')

const getDailyNwl = async ({
  narwhalLensContract,
  accountAddress
}: GetDailyXvsInput): Promise<IGetDailyXvsOutput> => {
  const response = await narwhalLensContract.methods
    .getDailyNWL(accountAddress, comptrollerAddress)
    .call()

  return {
    dailyNwlWei: new BigNumber(response)
  }
}

export default getDailyNwl
