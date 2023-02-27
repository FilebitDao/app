import { NError } from 'errors'

import { GetProposalInput, GetProposalOutput, ProposalApiResponse } from './types'

import { formatToProposal, restService } from 'utilities'

const getProposal = async ({ id }: GetProposalInput): Promise<GetProposalOutput> => {
  const response = await restService<ProposalApiResponse>({
    endpoint: `/proposals/${id}`,
    method: 'GET',
    params: { version: 'v2' }
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

  return formatToProposal(payload)
}

export default getProposal
