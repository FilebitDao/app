import { NFRC20_TOKENS } from 'constants/tokens'

import { checkForComptrollerTransactionError } from 'errors'

import { Comptroller } from 'types/contracts'
import type { TransactionReceipt } from 'web3-core/types'

export interface ClaimNWLRewardInput {
  comptrollerContract: Comptroller
  fromAccountAddress: string
}

export type ClaimNWLRewardOutput = TransactionReceipt

const claimNwlReward = async ({
  comptrollerContract,
  fromAccountAddress
}: ClaimNWLRewardInput): Promise<ClaimNWLRewardOutput> => {
  const NTokenAddresses = Object.values(NFRC20_TOKENS).map(nToken => nToken.address)

  const resp = await comptrollerContract.methods['claimNarwhal(address,address[])'](
    fromAccountAddress,
    NTokenAddresses
  ).send({
    from: fromAccountAddress
  })

  return checkForComptrollerTransactionError(resp)
}

export default claimNwlReward
