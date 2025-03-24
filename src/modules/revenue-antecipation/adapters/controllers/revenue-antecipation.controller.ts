import { Body, Controller, Post, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Response } from "express";
import { CreateRevenueAntecipationUsecase } from "../../application/use-cases/create-revenue-antecipation.usecase";
import { CreateRevenueAntecipationDto } from "../dto/create-revenue-antecipation.dto";

@UseGuards(AuthGuard(["api-key"]))
@Controller("antecipation")
export class RevenueAntecipationController {
  constructor(
    private readonly createRevenueAntecipationUsecase: CreateRevenueAntecipationUsecase,
  ) {}

  @Post("/create")
  async createRevenue(
    @Body() input: CreateRevenueAntecipationDto,
    @Res() res: Response,
  ) {
    const result = await this.createRevenueAntecipationUsecase.execute({
      walletId: input.walletId,
      tax_per_installment: input.tax_per_installment,
    });
    if (result.hasOwnProperty("error")) {
      return res.status(400).send(result);
    }
    return res.status(200).send(result);
  }
}
