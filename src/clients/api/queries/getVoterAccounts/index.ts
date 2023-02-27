import { NError } from 'errors'

import { GetVoterAccountsResponse } from './types'
import { VoterAccount } from 'types'

import { restService } from 'utilities'

import formatVoterAccountResponse from './formatVoterAccountResponse'

export interface GetVoterAccountsInput {
  page?: number
}

export interface GetVoterAccountsOutput {
  voterAccounts: VoterAccount[]
  limit: number
  offset: number
  total: number
}

const getVoterAccounts = async ({
  page = 0
}: GetVoterAccountsInput): Promise<GetVoterAccountsOutput> => {
  const response = await restService<GetVoterAccountsResponse>({
    endpoint: '/voters/accounts',
    method: 'GET',
    params: {
      limit: 16,
      offset: page * 16
    }
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
    throw new NError({ type: 'unexpected', code: 'somethingWentWrongRetrievingVoterAccounts' })
  }

  return formatVoterAccountResponse(payload)
}

export default getVoterAccounts
