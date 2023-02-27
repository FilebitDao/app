import { NwlVesting } from 'types/contracts'
import type { TransactionReceipt } from 'web3-core/types'

export interface WithdrawNwlInput {
  nwlVestingContract: NwlVesting
  accountAddress: string
}

export type WithdrawNwlOutput = TransactionReceipt

const withdrawNwl = ({
  nwlVestingContract,
  accountAddress
}: WithdrawNwlInput): Promise<WithdrawNwlOutput> =>
  nwlVestingContract.methods.withdraw().send({
    from: accountAddress
  })

export default withdrawNwl
