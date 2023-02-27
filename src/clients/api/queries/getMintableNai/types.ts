import BigNumber from 'bignumber.js'

import { NaiUnitroller } from 'types/contracts'

export interface GetMintableNaiInput {
  naiControllerContract: NaiUnitroller
  accountAddress: string
}

export interface GetMintableNaiOutput {
  mintableVaiWei: BigNumber
}
