import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { VolutiCredentialsDTO } from "../adapter/dto/upsert-voluti-credentials.dto";
import { UpsertVolutiCredentialsUseCase } from "../application/usecases/upsert-voluti-credentials.usecase";
import { Response } from "express";
import { GetVolutiCredentialsDto } from "../adapter/dto/get-voluti-credentials.dto";
import { ListVolutiCredentialsUseCase } from "../application/usecases/list-voluti-credentials.usecase";
@UseGuards(AuthGuard("api-key"))
@Controller("voluti-credentials")
export class VolutiCredentialsController {
  constructor(
    private readonly upsertVolutiCredentialsUseCase: UpsertVolutiCredentialsUseCase,
    private readonly listCredentialsCredentialsUseCase: ListVolutiCredentialsUseCase,
  ) {}
  @Post("/create")
  async create(@Body() input: VolutiCredentialsDTO, @Res() res: Response) {
    const result = await this.upsertVolutiCredentialsUseCase.execute(input);
    if (result.hasOwnProperty("error")) {
      return res.status(400).send(result);
    }
    return res.status(200).send(result);
  }
  @Get("/list/:adminId")
  async list(@Param() input: GetVolutiCredentialsDto) {
    return await this.listCredentialsCredentialsUseCase.execute(input);
  }
}
