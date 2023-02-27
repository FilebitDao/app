import { TOKEN_ADDRESSES } from 'constants/contracts/addresses'

import { FilChainId, Token } from 'types'

import beth from 'assets/img/tokens/beth.svg'
// import bnb from 'assets/img/tokens/bnb.svg'
import btc from 'assets/img/tokens/btc.svg'
import fil from 'assets/img/tokens/fil.svg'
import nai from 'assets/img/tokens/nai.svg'
import nwl from 'assets/img/tokens/nwl.svg'

export const MAINNET_TOKENS = {
  // bnb: {
  //   id: 'bnb',
  //   symbol: 'BNB',
  //   name: 'BNB',
  //   decimals: 18,
  //   address: '',
  //   asset: bnb,
  //   isNative: true
  // } as Token,
  nwl: {
    id: 'nwl',
    symbol: 'NWL',
    name: 'Narwhal',
    decimals: 18,
    address: TOKEN_ADDRESSES.nwl[FilChainId.MAINNET],
    asset: nwl
  } as Token,
  wbtc: {
    id: 'wbtc',
    symbol: 'WBTC',
    name: 'BitCoin',
    decimals: 18,
    address: TOKEN_ADDRESSES.btc[FilChainId.MAINNET],
    asset: btc
  } as Token,
  fil: {
    id: 'fil',
    symbol: 'FIL',
    name: 'FileCoin',
    decimals: 18,
    address: TOKEN_ADDRESSES.fil[FilChainId.MAINNET],
    asset: fil
  } as Token,
  weth: {
    id: 'weth',
    symbol: 'WETH',
    name: 'Ethereum',
    decimals: 18,
    address: TOKEN_ADDRESSES.eth[FilChainId.MAINNET],
    asset: beth
  } as Token,
  nai: {
    id: 'nai',
    symbol: 'NAI',
    name: 'Nai',
    decimals: 18,
    address: TOKEN_ADDRESSES.nai[FilChainId.MAINNET],
    asset: nai
  } as Token
}
