import BigNumber from 'bignumber.js'

import { Comptroller } from 'types/contracts'

export interface GetMintedNaiInput {
  comptrollerContract: Comptroller
  accountAddress: string
}

export type GetMintedNaiOutput = {
  mintedNaiWei: BigNumber
}

const getMintedNai = async ({
  comptrollerContract,
  accountAddress
}: GetMintedNaiInput): Promise<GetMintedNaiOutput> => {
  const res = await comptrollerContract.methods.mintedNAIs(accountAddress).call()

  return {
    mintedNaiWei: new BigNumber(res)
  }
}

export default getMintedNai
