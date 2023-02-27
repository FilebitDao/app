import { NError } from 'errors'

import { GetVotersApiResponse, GetVotersInput, GetVotersOutput } from './types'

import { restService } from 'utilities'

import formatToVoters from './formatToVoters'

export * from './types'

const getVoters = async ({
  id,
  filter,
  limit,
  offset
}: GetVotersInput): Promise<GetVotersOutput> => {
  const response = await restService<GetVotersApiResponse>({
    endpoint: `/voters/${id}`,
    method: 'GET',
    params: {
      filter,
      limit,
      offset
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
    throw new NError({ type: 'unexpected', code: 'somethingWentWrong' })
  }

  return formatToVoters(payload)
}

export default getVoters
