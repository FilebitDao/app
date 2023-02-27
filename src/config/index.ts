import sample from 'lodash/sample'

import { FIL_SCAN_URLS } from 'constants/bsc'
import { API_ENDPOINT_URLS, RPC_URLS } from 'constants/endpoints'

import { FilChainId } from 'types'

export interface Config {
  chainId: FilChainId
  isOnTestnet: boolean
  rpcUrl: string
  apiUrl: string
  filScanUrl: string
}

const chainId: FilChainId = process.env.REACT_APP_CHAIN_ID
  ? parseInt(process.env.REACT_APP_CHAIN_ID, 10)
  : FilChainId.MAINNET

const isOnTestnet = chainId === FilChainId.TESTNET
const rpcUrl = sample(RPC_URLS[chainId]) as string
const apiUrl = API_ENDPOINT_URLS[chainId]
const filScanUrl = FIL_SCAN_URLS[chainId]

const config: Config = {
  chainId,
  isOnTestnet,
  rpcUrl,
  apiUrl,
  filScanUrl
}

export default config
