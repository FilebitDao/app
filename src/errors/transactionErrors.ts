import type { TransactionReceipt } from 'web3-core'

import {
  ComptrollerErrorReporterError,
  ComptrollerErrorReporterFailureInfo,
  NaiControllerErrorReporterError,
  NaiControllerErrorReporterFailureInfo,
  NaiVaultErrorReporterError,
  NaiVaultErrorReporterInfo,
  NwlVaultProxyErrorReporterError,
  NwlVaultProxyErrorReporterInfo,
  TokenErrorReporterError,
  TokenErrorReporterFailureInfo
} from 'constants/contracts/errorReporter'

import { NError, NErrorPhraseMap } from './NError'

export const checkForTransactionError = (
  receipt: TransactionReceipt,
  errorEnum:
    | typeof ComptrollerErrorReporterError
    | typeof TokenErrorReporterError
    | typeof NaiControllerErrorReporterError
    | typeof NaiVaultErrorReporterError
    | typeof NwlVaultProxyErrorReporterError,
  infoEnum:
    | typeof ComptrollerErrorReporterFailureInfo
    | typeof TokenErrorReporterFailureInfo
    | typeof NaiControllerErrorReporterFailureInfo
    | typeof NaiVaultErrorReporterInfo
    | typeof NwlVaultProxyErrorReporterInfo
) => {
  if (receipt.events?.Failure) {
    const { error, info } = receipt.events?.Failure.returnValues
    throw new NError({
      type: 'transaction',
      code: errorEnum[error] as NErrorPhraseMap['transaction'],
      data: {
        error: errorEnum[error] as NErrorPhraseMap['transaction'],
        info: infoEnum[info] as NErrorPhraseMap['transaction']
      },
      receipt
    })
  }
  return receipt
}

export const checkForComptrollerTransactionError = (receipt: TransactionReceipt) =>
  checkForTransactionError(
    receipt,
    ComptrollerErrorReporterError,
    ComptrollerErrorReporterFailureInfo
  )

export const checkForTokenTransactionError = (receipt: TransactionReceipt) =>
  checkForTransactionError(receipt, TokenErrorReporterError, TokenErrorReporterFailureInfo)

export const checkForNaiControllerTransactionError = (receipt: TransactionReceipt) =>
  checkForTransactionError(
    receipt,
    NaiControllerErrorReporterError,
    NaiControllerErrorReporterFailureInfo
  )

export const checkForNaiVaultTransactionError = (receipt: TransactionReceipt) =>
  checkForTransactionError(receipt, NaiVaultErrorReporterError, NaiVaultErrorReporterInfo)

export const checkForNwlVaultProxyTransactionError = (receipt: TransactionReceipt) =>
  checkForTransactionError(receipt, NwlVaultProxyErrorReporterError, NwlVaultProxyErrorReporterInfo)
