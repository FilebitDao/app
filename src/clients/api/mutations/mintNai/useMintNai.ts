import { MutationObserverOptions, useMutation } from 'react-query'

import { MintNaiInput, MintNaiOutput, mintVai, queryClient } from 'clients/api'
import { useNaiUnitrollerContract } from 'clients/contracts/hooks'

import FunctionKey from 'constants/functionKey'

type Options = MutationObserverOptions<
  MintNaiOutput,
  Error,
  Omit<MintNaiInput, 'naiControllerContract'>
>

const useMintNai = (options?: Options) => {
  const naiControllerContract = useNaiUnitrollerContract()

  return useMutation(
    FunctionKey.MINT_NAI,
    (params: Omit<MintNaiInput, 'naiControllerContract'>) =>
      mintVai({
        naiControllerContract,
        ...params
      }),
    {
      ...options,
      onSuccess: (...onSuccessParams) => {
        queryClient.invalidateQueries(FunctionKey.GET_MINTED_NAI)
        queryClient.invalidateQueries(FunctionKey.GET_N_TOKEN_BALANCES_ALL)

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams)
        }
      }
    }
  )
}

export default useMintNai
