import { PrismaClientError } from './PrismaClientError'

export const IsPrismaError = (Error: PrismaClientError) => {
  return (
    typeof Error.code === 'string' &&
    typeof Error.clientVersion === 'string' &&
    (typeof Error.meta === 'undefined' || typeof Error.meta === 'object')
  )
}
