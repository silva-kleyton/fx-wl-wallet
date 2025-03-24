import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Response } from "express";
import { TransfeeraCredentialsDTO } from "../adapter/dto/create-transfeera-credentials.dto";
import { DeleteTransfeeraCredentialsDto } from "../adapter/dto/delete-transfeera-credentials.dto";
import { RetrieveTransfeeraCredentialsDto } from "../adapter/dto/retrieve-transfeera-credentials.dto";
import { UpdateTransfeeraCredentialsDto } from "../adapter/dto/update-transfeera-credentials.dto";
import { DeleteTransfeeraCredentialsUseCase } from "../application/usecases/delete-transfeera-credentials.usecase";
import { CreateTransfeeraCredentialsUsecase } from "../usecases/../application/usecases/create-transfeera-credentials.usecase";
import { ListTransfeeraCredentialsUseCase } from "../usecases/../application/usecases/list-transfeera-credentials.usecase";
import { UpdateTransfeeraCredentialsUseCase } from "../usecases/../application/usecases/update-transfeera-credentials.usecase";
@UseGuards(AuthGuard("api-key"))
@Controller("transfeera-credentials")
export class TransferaCredentialsController {
  constructor(
    private readonly createTransfeeraCredentialsUsecase: CreateTransfeeraCredentialsUsecase,
    private readonly updateTransfeeraCredentialsUsecase: UpdateTransfeeraCredentialsUseCase,
    private readonly listTransfeeraCredentialsUseCase: ListTransfeeraCredentialsUseCase,
    private readonly deleteTransfeeraCredentialsUseCase: DeleteTransfeeraCredentialsUseCase,
  ) {}
  @Post("/create")
  async create(@Body() input: TransfeeraCredentialsDTO, @Res() res: Response) {
    const result = await this.createTransfeeraCredentialsUsecase.execute(input);
    if (result.hasOwnProperty("error")) {
      return res.status(400).send(result);
    }
    return res.status(200).send(result);
  }
  @Put("/update")
  async update(
    @Body() input: UpdateTransfeeraCredentialsDto,
    @Res() res: Response,
  ) {
    const result = await this.updateTransfeeraCredentialsUsecase.execute(input);
    if (result.hasOwnProperty("error")) {
      return res.status(400).send(result);
    }
    return res.status(200).send(result);
  }
  @Get("/list/:adminId")
  async list(@Param() input: RetrieveTransfeeraCredentialsDto) {
    return await this.listTransfeeraCredentialsUseCase.execute(input);
  }
  @Delete("/delete/:adminId")
  async delete(
    @Param() input: DeleteTransfeeraCredentialsDto,
    @Res() res: Response,
  ) {
    const result = await this.deleteTransfeeraCredentialsUseCase.execute(input);
    if (result.hasOwnProperty("error")) {
      return res.status(400).send(result);
    }
    return res.status(200).send(result);
  }
}
