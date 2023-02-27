import { useClaimXvsVaultReward, useclaimNaiVaultReward } from 'clients/api'

import { TOKENS } from 'constants/tokens'

import { NError } from 'errors'

import { unsafelyGetToken } from 'utilities'

interface StakeInput {
  rewardTokenId: string
  stakedTokenId: string
  accountAddress: string
  poolIndex?: number
}

const useClaimVaultReward = () => {
  const { mutateAsync: claimNwlVaultRewardLoading, isLoading: isClaimXvsVaultRewardLoading } =
    useClaimXvsVaultReward()

  const { mutateAsync: claimNaiVaultReward, isLoading: isclaimNaiVaultReward } =
    useclaimNaiVaultReward()

  const isLoading = isClaimXvsVaultRewardLoading || isclaimNaiVaultReward

  const claimReward = async ({
    rewardTokenId,
    stakedTokenId,
    accountAddress,
    poolIndex
  }: StakeInput) => {
    if (typeof poolIndex === 'number') {
      const rewardTokenAddress = unsafelyGetToken(rewardTokenId).address

      return claimNwlVaultRewardLoading({
        poolIndex,
        fromAccountAddress: accountAddress,
        rewardTokenAddress
      })
    }

    if (stakedTokenId === TOKENS.nai.id) {
      return claimNaiVaultReward({
        fromAccountAddress: accountAddress
      })
    }

    // This cose should never be reached, but just in case we throw a generic
    // internal error
    throw new NError({
      type: 'unexpected',
      code: 'somethingWentWrong'
    })
  }

  return {
    isLoading,
    claimReward
  }
}

export default useClaimVaultReward
