import BigNumber from 'bignumber.js'

import { NFilToken, NFrc20 } from 'types/contracts'

export interface GetNTokenCashInput {
  nTokenContract: NFrc20 | NFilToken
}

export type GetNTokenCashOutput = {
  cashWei: BigNumber
}

const getNTokenCash = async ({
  nTokenContract
}: GetNTokenCashInput): Promise<GetNTokenCashOutput> => {
  const res = await nTokenContract.methods.getCash().call()

  return {
    cashWei: new BigNumber(res)
  }
}

export default getNTokenCash
