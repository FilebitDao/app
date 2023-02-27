import { NFrc20_TOKEN_ADDRESSES } from 'constants/contracts/addresses'
import { TESTNET_TOKENS } from 'constants/tokens/common/testnet'

import { FilChainId, NToken } from 'types'

// import nBnb from 'assets/img/tokens/nBnb.svg'
import nBtc from 'assets/img/tokens/nBtc.svg'
import nEth from 'assets/img/tokens/nEth.svg'
import nFil from 'assets/img/tokens/nFil.svg'
import nNai from 'assets/img/tokens/nai.svg'

export const TESTNET_NFRC20_TOKENS = {
  // bnb: {
  //   id: 'bnb',
  //   symbol: 'nBNB',
  //   address: NFrc20_TOKEN_ADDRESSES.bnb[FilChainId.TESTNET],
  //   decimals: 8,
  //   asset: nBnb,
  //   underlyingToken: TESTNET_TOKENS.bnb
  // } as NToken,
  wbtc: {
    id: 'wbtc',
    symbol: 'nBTC',
    address: NFrc20_TOKEN_ADDRESSES.btc[FilChainId.TESTNET],
    decimals: 8,
    asset: nBtc,
    underlyingToken: TESTNET_TOKENS.wbtc
  } as NToken,
  weth: {
    id: 'weth',
    symbol: 'nETH',
    address: NFrc20_TOKEN_ADDRESSES.eth[FilChainId.TESTNET],
    decimals: 8,
    asset: nEth,
    underlyingToken: TESTNET_TOKENS.weth
  } as NToken,
  fil: {
    id: 'fil',
    symbol: 'nFIL',
    address: NFrc20_TOKEN_ADDRESSES.fil[FilChainId.TESTNET],
    decimals: 8,
    asset: nFil,
    underlyingToken: TESTNET_TOKENS.fil
  } as NToken,
  nai: {
    id: 'nai',
    symbol: 'nNAI',
    address: NFrc20_TOKEN_ADDRESSES.nai[FilChainId.TESTNET],
    decimals: 8,
    asset: nNai,
    underlyingToken: TESTNET_TOKENS.nai
  } as NToken
}
