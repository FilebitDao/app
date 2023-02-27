import Web3 from 'web3'
import { AbiItem } from 'web3-utils'

import { getWeb3NoAccount } from 'clients/web3'

import NFilTokenAbi from 'constants/contracts/abis/NFilToken.json'
import NFrc20Abi from 'constants/contracts/abis/NFrc20.json'
import ComptrollerAbi from 'constants/contracts/abis/comptroller.json'
import FaucetAbi from 'constants/contracts/abis/faucet.json'
import Frc20Abi from 'constants/contracts/abis/frc20.json'
import GovernorBravoDelegateAbi from 'constants/contracts/abis/governorBravoDelegate.json'
import InterestModelAbi from 'constants/contracts/abis/interestModel.json'
import MaximillionAbi from 'constants/contracts/abis/maximillion.json'
import NaiTokenAbi from 'constants/contracts/abis/naiToken.json'
import NaiUnitrollerAbi from 'constants/contracts/abis/naiUnitroller.json'
import NaiVaultAbi from 'constants/contracts/abis/naiVault.json'
import NarwhalLensAbi from 'constants/contracts/abis/narwhalLens.json'
import NwlTokenAbi from 'constants/contracts/abis/nwlToken.json'
import NwlVaultAbi from 'constants/contracts/abis/nwlVault.json'
import NwlVaultStoreAbi from 'constants/contracts/abis/nwlVaultStore.json'
import NwlVestingAbi from 'constants/contracts/abis/nwlVesting.json'
import OracleAbi from 'constants/contracts/abis/oracle.json'
import { TOKENS } from 'constants/tokens'

import { NTokenContract, TokenContract } from './types'
import { Token } from 'types'
import {
  Comptroller,
  Faucet,
  Frc20,
  GovernorBravoDelegate,
  InterestModel,
  Maximillion,
  NaiUnitroller,
  NaiVault,
  NarwhalLens,
  NwlVault,
  NwlVaultStore,
  NwlVesting,
  Oracle
} from 'types/contracts'

import { getContractAddress, unsafelyGetNToken } from 'utilities'

const getContract = <T>(abi: AbiItem | AbiItem[], address: string, web3Instance: Web3) => {
  const web3 = web3Instance ?? getWeb3NoAccount()
  return new web3.eth.Contract(abi, address) as unknown as T
}

export const getTokenContract = (token: Token, web3: Web3) => {
  if (token.address === TOKENS.nwl.address) {
    return getContract<TokenContract<'nwl'>>(NwlTokenAbi as AbiItem[], token.address, web3)
  }

  if (token.address === TOKENS.nai.address) {
    return getContract<TokenContract<'nai'>>(NaiTokenAbi as AbiItem[], token.address, web3)
  }

  return getContract<TokenContract>(Frc20Abi as AbiItem[], token.address, web3)
}

export const getTokenContractByAddress = (address: string, web3: Web3): Frc20 =>
  getContract(Frc20Abi as AbiItem[], address, web3) as unknown as Frc20

export const getNTokenContract = <T extends string>(tokenId: T, web3: Web3): NTokenContract<T> => {
  const nFrc20TokenAddress = unsafelyGetNToken(tokenId).address

  if (tokenId === 'fil') {
    return getContract(
      NFilTokenAbi as AbiItem[],
      nFrc20TokenAddress,
      web3
    ) as unknown as NTokenContract<T>
  }

  return getContract(
    NFrc20Abi as AbiItem[],
    nFrc20TokenAddress,
    web3
  ) as unknown as NTokenContract<T>
}

export const getFaucetContract = (web3: Web3) =>
  getContract(FaucetAbi as AbiItem[], getContractAddress('faucet'), web3) as unknown as Faucet

export const getNaiUnitrollerContract = (web3: Web3) =>
  getContract(
    NaiUnitrollerAbi as AbiItem[],
    getContractAddress('naiUnitroller'),
    web3
  ) as unknown as NaiUnitroller

export const getNaiVaultContract = (web3: Web3) =>
  getContract(NaiVaultAbi as AbiItem[], getContractAddress('naiVault'), web3) as unknown as NaiVault

export const getNwlVaultContract = (web3: Web3) =>
  getContract(NwlVaultAbi as AbiItem[], getContractAddress('nwlVault'), web3) as unknown as NwlVault

export const getNwlVaultProxyContract = (web3: Web3) =>
  getContract(
    NwlVaultAbi as AbiItem[],
    getContractAddress('nwlVaultProxy'),
    web3
  ) as unknown as NwlVault

export const getNwlVaultStoreContract = (web3: Web3) =>
  getContract(
    NwlVaultStoreAbi as AbiItem[],
    getContractAddress('nwlVaultStore'),
    web3
  ) as unknown as NwlVaultStore

export const getComptrollerContract = (web3: Web3) =>
  getContract(
    ComptrollerAbi as AbiItem[],
    getContractAddress('comptroller'),
    web3
  ) as unknown as Comptroller

export const getPriceOracleContract = (web3: Web3) =>
  getContract(OracleAbi as AbiItem[], getContractAddress('oracle'), web3) as unknown as Oracle

export const getInterestModelContract = (address: string, web3: Web3) =>
  getContract(InterestModelAbi as AbiItem[], address, web3) as unknown as InterestModel

export const getNarwhalLensContract = (web3: Web3) =>
  getContract(
    NarwhalLensAbi as AbiItem[],
    getContractAddress('narwhalLens'),
    web3
  ) as unknown as NarwhalLens

export const getGovernorBravoDelegateContract = (web3: Web3) =>
  getContract(
    GovernorBravoDelegateAbi as AbiItem[],
    getContractAddress('governorBravoDelegator'),
    web3
  ) as unknown as GovernorBravoDelegate

export const getMaximillionContract = (web3: Web3) =>
  getContract(
    MaximillionAbi as AbiItem[],
    getContractAddress('maximillion'),
    web3
  ) as unknown as Maximillion

export const getNwlVestingProxyContract = (web3: Web3) =>
  getContract(
    NwlVestingAbi as AbiItem[],
    getContractAddress('nwlVestingProxy'),
    web3
  ) as unknown as NwlVesting
