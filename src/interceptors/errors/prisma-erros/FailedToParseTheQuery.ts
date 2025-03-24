import { ConflictError } from './ConflictError'
import { PrismaClientError } from './PrismaClientError'

export class FailedtoParserTheQuery extends ConflictError {
  constructor(e: PrismaClientError) {
    const uniqueField = e.meta.target

    super(`Failed to parse the query ${uniqueField}`)
  }
}
