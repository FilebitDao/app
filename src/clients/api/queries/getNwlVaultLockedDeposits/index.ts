import { GetNwlVaultLockedDepositsInput, GetNwlVaultLockedDepositsOutput } from './types'

import formatToLockedDeposit from './formatToLockedDeposit'

const getNwlVaultLockedDeposits = async ({
  nwlVaultContract,
  rewardTokenAddress,
  poolIndex,
  accountAddress
}: GetNwlVaultLockedDepositsInput): Promise<GetNwlVaultLockedDepositsOutput> => {
  const res = await nwlVaultContract.methods
    .getWithdrawalRequests(rewardTokenAddress, poolIndex, accountAddress)
    .call()

  return {
    lockedDeposits: res.map(formatToLockedDeposit)
  }
}

export default getNwlVaultLockedDeposits
