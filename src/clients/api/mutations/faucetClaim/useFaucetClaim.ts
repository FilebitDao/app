import { MutationObserverOptions, useMutation } from 'react-query'

import { ClaimFaucetInput, ClaimFaucetOutput, faucetClaim } from 'clients/api'
import { useFaucetContractContract } from 'clients/contracts/hooks'

import FunctionKey from 'constants/functionKey'

const useFaucetCliam = (
  options?: MutationObserverOptions<
    ClaimFaucetOutput,
    Error,
    Omit<ClaimFaucetInput, 'faucetContract'>
  >
) => {
  const faucetContract = useFaucetContractContract()
  return useMutation(
    FunctionKey.FAUCET_CLIAIM,
    (params: Omit<ClaimFaucetInput, 'faucetContract'>) =>
      faucetClaim({
        faucetContract,
        ...params
      }),
    {
      ...options
    }
  )
}

export default useFaucetCliam
