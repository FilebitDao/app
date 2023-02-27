import BigNumber from 'bignumber.js'
import Web3 from 'web3'

import { getTokenContract } from 'clients/contracts'

import { TOKENS } from 'constants/tokens'

import { Token } from 'types'

export type TOKENID = keyof typeof TOKENS

export interface GetBalanceOfInput {
  web3: Web3
  accountAddress: string
  token: Token
}

export type GetBalanceOfOutput = {
  tokenId: TOKENID | string
  balanceWei: BigNumber
}

const getBalanceOf = async ({
  web3,
  accountAddress,
  token
}: GetBalanceOfInput): Promise<GetBalanceOfOutput> => {
  let balanceWei: BigNumber = new BigNumber(0)

  if (accountAddress) {
    if (token.isNative) {
      const resp = await web3.eth.getBalance(accountAddress)
      balanceWei = new BigNumber(resp)
    } else {
      const tokenContract = getTokenContract(token, web3)
      const resp = await tokenContract.methods.balanceOf(accountAddress).call()
      balanceWei = new BigNumber(resp)
    }
  }

  return {
    tokenId: token.id,
    balanceWei
  }
}

export default getBalanceOf
