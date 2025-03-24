import { Controller, Get, Post, Body, Param, Req } from "@nestjs/common";
import { MilesService } from "./miles.service";
import { PointsDto } from "./dto/points.dto";
import { QuotationMileDto } from "./dto/quotation-mile.dto";
import { PercentageMileDto } from "./dto/percentage-mile.dto";
import { OptionalParamsFindMileDto } from "./dto/optional-params-find-mile.dto";

@Controller("milhas")
export class MilesController {
  constructor(private readonly milesService: MilesService) {}

  @Post("pontuacao")
  pointsConversion(@Body() pointsDto: PointsDto) {
    return this.milesService.pointsConversion(pointsDto);
  }

  @Get("pontuacao/:userId")
  getPoints(@Param("userId") userId: string) {
    return this.milesService.getPoints(userId);
  }

  @Post("cotacao")
  quotation(@Body() quotationMileDto: QuotationMileDto) {
    return this.milesService.quotation(quotationMileDto);
  }

  @Post("porcentagem")
  percentage(@Body() percentageMileDto: PercentageMileDto) {
    return this.milesService.percentage(percentageMileDto);
  }

  @Post("enviar-123milhas")
  sendToMilesApi(@Body() pointsDto: PointsDto) {
    return this.milesService.sendToMilesApi(pointsDto);
  }

  @Get("check-points")
  checkPointsToReDeem() {
    return this.milesService.checkPointsToReDeem();
  }

  @Post("extrato-pontos")
  getPointsHistory(
    @Body() optionalParamsFindMileDto: OptionalParamsFindMileDto
  ) {
    return this.milesService.getPointsHistory(optionalParamsFindMileDto);
  }
}
