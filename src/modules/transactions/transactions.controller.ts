import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { HttpStatusCode } from "axios";
import { PaginationParams } from "../../utils/paginations/dto/paginationParams";
import { CreateManualTransactionDTO } from "./dto/create-manual-transaction.dto";
import { OptionsParamsTransactions } from "./dto/optional-params-transactions.dto";
import { WithdrawRequestBodyDto } from "./dto/withdraw-request-body.dto";
import { TransactionsService } from "./transactions.service";

@UseGuards(AuthGuard(["api-key", "jwt"]))
@Controller("transactions")
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post("/withdraw/:userId")
  @HttpCode(HttpStatusCode.NoContent)
  withdrawRequestViaPix(
    @Param("userId") userId: string,
    @Body() body: WithdrawRequestBodyDto,
  ) {
    return this.transactionsService.withdraw({
      userId,
      amount: body.amount,
      requestId: body.requestId,
    });
  }

  @Get("/:userId")
  findAll(
    @Param("userId") userId: string,
    @Query() { page, limit }: PaginationParams,
    @Query() optionalParams: OptionsParamsTransactions,
  ) {
    const pagination: PaginationParams =
      page && limit ? { page: Number(page), limit: Number(limit) } : undefined;

    return this.transactionsService.findAll(userId, pagination, optionalParams);
  }

  @Get("antecipation/:userId")
  findTransaction(@Param("userId") userId: string) {
    return this.transactionsService.findTransaction(userId);
  }

  @Post("manual")
  createManualTransaction(@Body() input: CreateManualTransactionDTO) {
    return this.transactionsService.createManualTransaction(input);
  }

  @Get("byadmin/:adminId")
  async findByAdmin(
    @Param("adminId") adminId: string,
    @Query() { page, limit }: PaginationParams,
  ) {
    const pagination: PaginationParams =
      page && limit ? { page: Number(page), limit: Number(limit) } : undefined;
    return await this.transactionsService.findByAdmin(adminId, pagination);
  }
}
