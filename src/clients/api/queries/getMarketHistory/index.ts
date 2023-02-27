import { NError } from 'errors'

import { MarketSnapshot } from 'types'

import { restService, unsafelyGetNToken } from 'utilities'

export interface GetMarketHistoryResponse {
  limit: number
  total: number
  data: MarketSnapshot[]
}

export interface GetMarketHistoryInput {
  nTokenId: string
  limit?: number
  type?: string
}

export type GetMarketHistoryOutput = {
  marketSnapshots: MarketSnapshot[]
}

const getMarketHistory = async ({
  nTokenId,
  limit = 30,
  type = '1day'
}: GetMarketHistoryInput): Promise<GetMarketHistoryOutput> => {
  const tokenAddress = unsafelyGetNToken(nTokenId).address

  let endpoint = `/assetHistory?asset=${tokenAddress}&type=${type}`
  if (limit) {
    endpoint += `&limit=${limit}`
  }

  const response = await restService<MarketSnapshot[]>({
    endpoint,
    method: 'GET'
  })

  if ('result' in response && response.result === 'error') {
    throw new NError({
      type: 'unexpected',
      code: 'somethingWentWrong',
      data: { message: response.message }
    })
  }

  return {
    marketSnapshots: response.data?.data || []
  }
}

export default getMarketHistory
