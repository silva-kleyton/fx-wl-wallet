import {
  NestInterceptor,
  Injectable,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common'

import { catchError, Observable } from 'rxjs'
import { DatabaseError } from './errors/prisma-erros/DatabaseError'
import { handleDatabesErrors } from './handle-database-errors'
import { IsPrismaError } from './errors/prisma-erros/isPrismaError'

@Injectable()
export class DatabaseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error: any): any => {
        if (IsPrismaError(error)) {
          error = handleDatabesErrors(error)
        }
        if (error instanceof DatabaseError) {
          throw new BadRequestException(error.message)
        } else {
          throw error
        }
      }),
    )
  }
}
