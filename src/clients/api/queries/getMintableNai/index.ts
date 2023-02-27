import { GetMintableNaiInput, GetMintableNaiOutput } from './types'

import formatToOutput from './formatToOutput'

export * from './types'

const getMintableVai = async ({
  naiControllerContract,
  accountAddress
}: GetMintableNaiInput): Promise<GetMintableNaiOutput> => {
  const res = await naiControllerContract.methods.getMintableNAI(accountAddress).call()

  return formatToOutput(res)
}

export default getMintableVai
