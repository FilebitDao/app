import BigNumber from 'bignumber.js'
import Web3 from 'web3'

import { getMaximillionContract, getNTokenContract } from 'clients/contracts'

import { NFRC20_TOKENS } from 'constants/tokens'

import { checkForTokenTransactionError } from 'errors'

import type { TransactionReceipt } from 'web3-core/types'

export interface RepayNativeTokenInput {
  web3: Web3
  fromAccountAddress: string
  amountWei: BigNumber
  isRepayingFullLoan?: boolean
}

export type RepayNativeTokenOutput = TransactionReceipt

export const REPAYMENT_NATIVE_BUFFER_PERCENTAGE = 0.001

const repayNativeToken = async ({
  web3,
  fromAccountAddress,
  amountWei,
  isRepayingFullLoan = false
}: RepayNativeTokenInput): Promise<RepayNativeTokenOutput> => {
  let resp: TransactionReceipt

  // If we're repaying a full loan, we need to call the Maximillion contract to
  // do so. If we partially repay a loan, we need to send the BNB amount to
  // repay to the vBnB contract
  if (isRepayingFullLoan) {
    const maximillionContract = getMaximillionContract(web3)
    const amountWithBuffer = amountWei.multipliedBy(1 + REPAYMENT_NATIVE_BUFFER_PERCENTAGE)

    resp = await maximillionContract.methods
      .repayBehalfExplicit(fromAccountAddress, NFRC20_TOKENS.fil.address)
      .send({
        from: fromAccountAddress,
        value: amountWithBuffer.toFixed(0)
      })
  } else {
    const vBnbContract = getNTokenContract('fil', web3)
    const contractData = vBnbContract.methods.repayBorrow().encodeABI()

    resp = await web3.eth.sendTransaction({
      from: fromAccountAddress,
      to: NFRC20_TOKENS.fil.address,
      value: amountWei.toFixed(),
      data: contractData
    })
  }

  return checkForTokenTransactionError(resp)
}

export default repayNativeToken
