import { NError } from 'errors'

import { GetVoterDetailsResponse } from './types'
import { VoterDetails } from 'types'

import { restService } from 'utilities'

import formatVoterDetailsResponse from './formatVoterDetailsResponse'

export interface GetVoterDetailsInput {
  address: string
}

export type GetVoterDetailsOutput = VoterDetails

const getVoterDetails = async ({
  address
}: GetVoterDetailsInput): Promise<GetVoterDetailsOutput> => {
  const response = await restService<GetVoterDetailsResponse>({
    endpoint: `/voters/accounts/${address}`,
    method: 'GET'
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
    throw new NError({ type: 'unexpected', code: 'somethingWentWrongRetrievingVoterDetails' })
  }

  return formatVoterDetailsResponse(payload, address)
}

export default getVoterDetails
