import { TOKENS } from 'constants/tokens'

type TOKENID = keyof typeof TOKENS

export const unsafelyGetToken = (id: TOKENID | string) => TOKENS[id as TOKENID]

export default unsafelyGetToken
