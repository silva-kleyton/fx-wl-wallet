import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Response } from "express";
import { WithdrawUseCase } from "../../application/usecases/with-draw.usecase";
import { InputFinishWithdraw } from "../dto/finish-withdraw.dto";
import { FinishWithdrawUseCase } from "../../application/usecases/finish-with-draw.usecase";
import { CreateTransferDTO } from "../dto/transfeera/create-transaction.dto";

@UseGuards(AuthGuard(["api-key", "jwt"]))
@Controller("withdraw")
export class WithDrawController {
  constructor(
    private readonly withdrawUseCase: WithdrawUseCase,
    private readonly finishWithdrawUseCase: FinishWithdrawUseCase,
  ) {}
  @Post()
  async create(@Body() input: CreateTransferDTO, @Res() res: Response) {
    const resulfOfWithDraw = await this.withdrawUseCase.execute(input);
    if (resulfOfWithDraw?.hasOwnProperty("error")) {
      return res.status(HttpStatus.BAD_REQUEST).send(resulfOfWithDraw);
    }
    return res.status(HttpStatus.OK).send(resulfOfWithDraw);
  }

  @Post("webhook")
  async finishWithdraw(@Body() input: InputFinishWithdraw) {
    return this.finishWithdrawUseCase.execute(input);
  }
}
