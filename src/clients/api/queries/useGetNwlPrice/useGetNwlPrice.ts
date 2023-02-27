import { useQuery } from 'react-query'

import { getNwlPrice } from 'clients/api'

import FunctionKey from 'constants/functionKey'

//  FIXME: get nwl price from contract or api
const useGetNwlPrice = () => useQuery([FunctionKey.GET_NWL_PRICE], getNwlPrice)

export default useGetNwlPrice
