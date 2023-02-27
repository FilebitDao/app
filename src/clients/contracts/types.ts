import { Frc20, NFilToken, NFrc20, NaiToken, NwlToken } from 'types/contracts'

export type TokenContract<T extends string = ''> = T extends 'nwl'
  ? NwlToken
  : T extends 'nai'
  ? NaiToken
  : Frc20

export type NTokenContract<T extends string> = T extends 'fil' ? NFilToken : NFrc20
