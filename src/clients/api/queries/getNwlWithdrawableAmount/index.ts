import BigNumber from 'bignumber.js'

import { NwlVesting } from 'types/contracts'

export interface GetNwlWithdrawableAmountInput {
  nwlVestingContract: NwlVesting
  accountAddress: string
}

export interface GetNwlWithdrawableAmountOutput {
  totalWithdrawableAmount: BigNumber
  totalVestedAmount: BigNumber
  totalWithdrawnAmount: BigNumber
}

const getNwlWithdrawableAmount = async ({
  nwlVestingContract,
  accountAddress
}: GetNwlWithdrawableAmountInput): Promise<GetNwlWithdrawableAmountOutput> => {
  const resp = await nwlVestingContract.methods.getWithdrawableAmount(accountAddress).call()
  return {
    totalWithdrawableAmount: new BigNumber(resp.totalWithdrawableAmount),
    totalVestedAmount: new BigNumber(resp.totalVestedAmount),
    totalWithdrawnAmount: new BigNumber(resp.totalWithdrawnAmount)
  }
}

export default getNwlWithdrawableAmount
