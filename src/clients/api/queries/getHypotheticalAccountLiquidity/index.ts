import BigNumber from 'bignumber.js'

import { Comptroller } from 'types/contracts'

export interface GetHypotheticalAccountLiquidityInput {
  comptrollerContract: Comptroller
  accountAddress: string
  nTokenAddress: string
  nTokenBalanceOfWei: BigNumber
  nTokenBorrowAmountWei?: BigNumber
}

export type GetHypotheticalAccountLiquidityOutput = { 0: string; 1: string; 2: string }

const getHypotheticalAccountLiquidity = ({
  comptrollerContract,
  accountAddress,
  nTokenAddress,
  nTokenBalanceOfWei,
  nTokenBorrowAmountWei = new BigNumber(0)
}: GetHypotheticalAccountLiquidityInput): Promise<GetHypotheticalAccountLiquidityOutput> =>
  comptrollerContract.methods
    .getHypotheticalAccountLiquidity(
      accountAddress.toLowerCase(),
      nTokenAddress,
      nTokenBalanceOfWei.toFixed(),
      nTokenBorrowAmountWei.toFixed()
    )
    .call()

export default getHypotheticalAccountLiquidity
