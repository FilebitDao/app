import { NError } from 'errors'

import { GetProposalsInput, GetProposalsOutput, ProposalsApiResponse } from './types'

import { formatToProposal, restService } from 'utilities'

export * from './types'

const getProposals = async ({
  page = 0,
  limit = 5
}: GetProposalsInput): Promise<GetProposalsOutput> => {
  const offset = page * limit

  const response = await restService<ProposalsApiResponse>({
    endpoint: '/proposals',
    method: 'GET',
    params: { offset, limit, version: 'v2' }
  })
  const payload = response.data?.data

  // @todo Add specific api error handling
  if ('result' in response && response.result === 'error') {
    throw new NError({
      type: 'unexpected',
      code: 'somethingWentWrong',
      data: { message: response.message }
    })
  }

  if (!payload) {
    throw new NError({ type: 'unexpected', code: 'somethingWentWrong' })
  }

  const { limit: payloadLimit, total, offset: payloadOffset } = payload
  const proposals = payload.result.map(p => formatToProposal(p))

  return { proposals, limit: payloadLimit, total, offset: payloadOffset }
}

export default getProposals
