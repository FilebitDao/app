import { MutationObserverOptions } from 'react-query'

import {
  SupplyNativeTokenInput,
  SupplyNativeTokenOutput,
  SupplyNativeTokenParams,
  SupplyNonBnbParams,
  SupplyNonNativeInput,
  SupplyNonNativeOutput,
  useSupplyNativeToken,
  useSupplyNonBnb
} from 'clients/api'

import { Asset } from 'types'

interface UseSupplyArgs {
  asset: Asset
  account: string
}

type OptionsSupplyBnb = MutationObserverOptions<
  SupplyNativeTokenOutput,
  Error,
  SupplyNativeTokenParams
>
type OptionsSupplyNonBnb = MutationObserverOptions<SupplyNonNativeOutput, Error, SupplyNonBnbParams>

export type UseSupplyParams =
  | Omit<SupplyNonNativeInput, 'tokenContract' | 'assetId' | 'account'>
  | Omit<SupplyNativeTokenInput, 'tokenContract' | 'assetId' | 'account'>

const useSupply = (
  { asset, account }: UseSupplyArgs,
  options?: OptionsSupplyBnb | OptionsSupplyNonBnb
) => {
  const useSupplyNonBnbResult = useSupplyNonBnb(
    {
      assetId: asset?.token.id,
      account
    },
    options as OptionsSupplyNonBnb
  )

  const useSupplyNativeTokenResult = useSupplyNativeToken({ account }, options as OptionsSupplyBnb)

  return asset.token.isNative ? useSupplyNativeTokenResult : useSupplyNonBnbResult
}

export default useSupply
