import BigNumber from 'bignumber.js'
import Web3 from 'web3'
import type { TransactionReceipt } from 'web3-core'

import { NFRC20_TOKENS } from 'constants/tokens'

import { checkForTokenTransactionError } from 'errors'

import { NFilToken } from 'types/contracts'

export interface SupplyNativeTokenInput {
  tokenContract: NFilToken
  web3: Web3
  account: string
  amountWei: BigNumber
}

export type SupplyNativeTokenOutput = TransactionReceipt

const supplyNativeToken = async ({
  web3,
  tokenContract,
  account,
  amountWei
}: SupplyNativeTokenInput): Promise<SupplyNativeTokenOutput> => {
  const contractData = tokenContract.methods.mint().encodeABI()
  const tx = {
    from: account,
    to: NFRC20_TOKENS.fil.address,
    value: amountWei.toFixed(),
    data: contractData
  }

  const resp = await web3.eth.sendTransaction(tx)
  return checkForTokenTransactionError(resp)
}

export default supplyNativeToken
