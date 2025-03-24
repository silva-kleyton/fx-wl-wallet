import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { BackofficeService } from "./backoffice.service";
import { ConfirmedAntecipationDto } from "./dto/confirmed-antecipation.dto";
import { ConfirmedWithdrawDto } from "./dto/confirmed-withdraw.dto";
import {
  CreateBackofficeDto,
  NotificationDto,
} from "./dto/create-backoffice.dto";
import { RequestAntecipationDto } from "./dto/request-antecipation.dto";

@UseGuards(AuthGuard(["api-key", "jwt"]))
@Controller("backoffice")
export class BackofficeController {
  constructor(private readonly backofficeService: BackofficeService) {}

  @Post("/confirmed-widthraw")
  confirmedWidthraw(@Body() confirmedWithdrawDto: ConfirmedWithdrawDto) {
    return this.backofficeService.confirmedWidthraw(confirmedWithdrawDto);
  }

  @Post("/confirmed-antecipation")
  confirmedAnticipation(
    @Body() confirmedAntecipationDto: ConfirmedAntecipationDto,
  ) {
    return this.backofficeService.confirmedAnticipation(
      confirmedAntecipationDto,
    );
  }

  /**
   * @deprecated
   */
  @Post("/:notification")
  create(
    @Body() createBackofficeDto: CreateBackofficeDto,
    @Param("notification") notificationDto: NotificationDto,
  ) {
    return this.backofficeService.create(createBackofficeDto, notificationDto);
  }

  @Post("request/antecipation")
  requestAntecipation(@Body() requestAntecipationDto: RequestAntecipationDto) {
    return this.backofficeService.requestAntecipation(requestAntecipationDto);
  }

  @Put("refused-request-withdraw/:id")
  refusedAntecipation(@Param("id") id: string) {
    return this.backofficeService.refusedAntecipation(id);
  }

  @Get("/request/:email")
  getSolicitation(@Param("email") email: string) {
    return this.backofficeService.getSolicitation(email);
  }

  @Get("/preview/antecipation/:email/:days")
  previewAntecipation(
    @Param("email") email: string,
    @Param("days") days: number,
  ) {
    return this.backofficeService.previewAntecipationValue(email, days);
  }

  @Get("/get-request-created-card-error")
  getRequestCreatedCardError() {
    return this.backofficeService.getRequestCreatedCardError();
  }

  @Put("/check-request-erro")
  checkRequestCreatedCardError(@Param("id") id: string) {
    return this.backofficeService.checkRequestCreatedCard(id);
  }
}
