import { MutationObserverOptions } from 'react-query'

import {
  RepayNativeTokenInput,
  RepayNativeTokenOutput,
  RepayNonNativeNTokenInput,
  RepayNonNativeNTokenOutput,
  useRepayNativeToken,
  useRepayNonNativeNToken
} from 'clients/api'

type Options = MutationObserverOptions<
  RepayNativeTokenOutput | RepayNonNativeNTokenOutput,
  Error,
  Omit<RepayNonNativeNTokenInput, 'nTokenContract'> | Omit<RepayNativeTokenInput, 'web3'>
>

const useRepayNToken = ({ nTokenId }: { nTokenId: string }, options?: Options) => {
  const useRepayNonNativeNTokenResult = useRepayNonNativeNToken(
    { nTokenId: nTokenId as Exclude<string, 'fil'> },
    options
  )
  const useRepayNativeTokenResult = useRepayNativeToken(options)

  return nTokenId === 'fil' ? useRepayNativeTokenResult : useRepayNonNativeNTokenResult
}

export default useRepayNToken
