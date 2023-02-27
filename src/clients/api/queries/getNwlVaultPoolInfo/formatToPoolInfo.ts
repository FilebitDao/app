import BigNumber from 'bignumber.js'

import { GetNwlVaultPoolInfoOutput } from './types'
import { NwlVault } from 'types/contracts'

const formatToUserInfo = ({
  token,
  allocPoint,
  lastRewardBlock,
  accRewardPerShare,
  lockPeriod
}: Awaited<
  ReturnType<ReturnType<NwlVault['methods']['poolInfos']>['call']>
>): GetNwlVaultPoolInfoOutput => ({
  stakedTokenAddress: token,
  allocationPoint: +allocPoint,
  lastRewardBlock: +lastRewardBlock,
  accRewardPerShare: new BigNumber(accRewardPerShare),
  lockingPeriodMs: +lockPeriod * 1000
})

export default formatToUserInfo
