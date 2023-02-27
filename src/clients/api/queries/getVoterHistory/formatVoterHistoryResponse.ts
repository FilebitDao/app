import BigNumber from 'bignumber.js'

import indexedVotingSupportNames from 'constants/indexedVotingSupportNames'

import { GetVoterHistoryResponse } from './types'

import { formatToProposal } from 'utilities'

const formatVoterHistoryResponse = (data: GetVoterHistoryResponse) => ({
  limit: data.limit,
  offset: data.offset,
  total: data.total,
  voterHistory: data.result.map(d => ({
    address: d.address,
    blockNumber: d.blockNumber,
    blockTimestamp: d.blockTimestamp,
    createdAt: new Date(d.createdAt),
    id: d.id,
    proposal: formatToProposal(d.proposal),
    reason: d.reason ? d.reason : undefined,
    support: d.hasVoted ? indexedVotingSupportNames[d.support] : 'NOT_VOTED',
    updatedAt: new Date(d.updatedAt),
    votesWei: new BigNumber(d.votes)
  }))
})

export default formatVoterHistoryResponse
