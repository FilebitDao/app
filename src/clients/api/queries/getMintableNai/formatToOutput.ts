import BigNumber from 'bignumber.js'

import { GetMintableNaiOutput } from './types'
import { NaiUnitroller } from 'types/contracts'

const formatToProposal = (
  response: Awaited<ReturnType<ReturnType<NaiUnitroller['methods']['getMintableNAI']>['call']>>
): GetMintableNaiOutput => ({
  mintableVaiWei: new BigNumber(response[1])
})

export default formatToProposal
