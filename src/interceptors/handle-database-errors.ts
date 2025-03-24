import { PrismaErros } from './errors/prisma-erros/enums/PrismaErros.dto'
import { PrismaClientError } from './errors/prisma-erros/PrismaClientError'
import { DatabaseError } from './errors/prisma-erros/DatabaseError'
import { UniqueConstraintError } from './errors/prisma-erros/UniqueConstraintError'

export const handleDatabesErrors = (error: PrismaClientError) => {
  switch (error.code) {
    case PrismaErros.UniqueConstraintFail:
      return new UniqueConstraintError(error)
    default:
      return new DatabaseError(error.message)
  }
}
