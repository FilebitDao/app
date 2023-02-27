import config from 'config'

import { MAINNET_NFRC20_TOKENS } from './Frc20/mainnet'
import { TESTNET_NFRC20_TOKENS } from './Frc20/testnet'
import { MAINNET_TOKENS } from './common/mainnet'
import { TESTNET_TOKENS } from './common/testnet'

export * from './common/mainnet'
export * from './common/testnet'
export * from './Frc20/testnet'
export * from './Frc20/testnet'

export const TOKENS = config.isOnTestnet ? TESTNET_TOKENS : MAINNET_TOKENS

export const NFRC20_TOKENS = config.isOnTestnet ? TESTNET_NFRC20_TOKENS : MAINNET_NFRC20_TOKENS
