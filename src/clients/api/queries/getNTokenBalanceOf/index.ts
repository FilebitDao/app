import BigNumber from 'bignumber.js'

import { NFilToken, NFrc20 } from 'types/contracts'

export interface GetNTokenBalanceOfInput {
  nTokenContract: NFrc20 | NFilToken
  accountAddress: string
}

export type GetNTokenBalanceOfOutput = {
  balanceWei: BigNumber
}

const getNTokenBalanceOf = async ({
  nTokenContract,
  accountAddress
}: GetNTokenBalanceOfInput): Promise<GetNTokenBalanceOfOutput> => {
  const res = await nTokenContract.methods.balanceOf(accountAddress).call()

  return {
    balanceWei: new BigNumber(res)
  }
}

export default getNTokenBalanceOf
