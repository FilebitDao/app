import { GetNTokenInterestRateModelInput, GetNTokenInterestRateModelOutput } from './types'

const getNTokenInterestRateModel = async ({
  nTokenContract
}: GetNTokenInterestRateModelInput): Promise<GetNTokenInterestRateModelOutput> => {
  const contractAddress = await nTokenContract.methods.interestRateModel().call()

  return {
    contractAddress
  }
}

export default getNTokenInterestRateModel
