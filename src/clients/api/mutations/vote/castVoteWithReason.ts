import { GovernorBravoDelegate } from 'types/contracts'
import type { TransactionReceipt } from 'web3-core/types'

export interface HookParams {
  governorBravoContract: GovernorBravoDelegate
  fromAccountAddress: string
}

export interface CastVoteWithReasonInput {
  proposalId: number
  voteType: 0 | 1 | 2
  voteReason: string
}

export type CastVoteWithReasonOutput = TransactionReceipt

const castVoteWithReason = async ({
  governorBravoContract,
  fromAccountAddress,
  proposalId,
  voteType,
  voteReason
}: CastVoteWithReasonInput & HookParams): Promise<CastVoteWithReasonOutput> =>
  governorBravoContract.methods
    .castVoteWithReason(proposalId, voteType, voteReason)
    .send({ from: fromAccountAddress })

export default castVoteWithReason
