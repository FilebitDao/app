import BigNumber from 'bignumber.js'

import { GetNwlVaultUserInfoOutput } from './types'
import { NwlVault } from 'types/contracts'

const formatToUserInfo = ({
  amount,
  pendingWithdrawals,
  rewardDebt
}: Awaited<
  ReturnType<ReturnType<NwlVault['methods']['getUserInfo']>['call']>
>): GetNwlVaultUserInfoOutput => ({
  stakedAmountWei: new BigNumber(amount),
  pendingWithdrawalsTotalAmountWei: new BigNumber(pendingWithdrawals),
  rewardDebtAmountWei: new BigNumber(rewardDebt)
})

export default formatToUserInfo
