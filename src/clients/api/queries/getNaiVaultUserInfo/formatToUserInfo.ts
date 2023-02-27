import BigNumber from 'bignumber.js'

import { GetNaiVaultUserInfoOutput } from './types'
import { NaiVault } from 'types/contracts'

const formatToUserInfo = ({
  amount
}: Awaited<
  ReturnType<ReturnType<NaiVault['methods']['userInfo']>['call']>
>): GetNaiVaultUserInfoOutput => ({
  stakedNaiWei: new BigNumber(amount)
})

export default formatToUserInfo
