import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthenticatedRequest } from "../auth/interfaces/user.authorizated";
import { CreditCardService } from "./credit-card.service";
import { CreateCardOffFlowDto } from "./dto/create-card-off-flow.dto";
import { CreateCreditCardNewDto } from "./dto/create-credit-card-new.dto";
import { CreateCreditCardDto } from "./dto/create-credit-card.dto";
import { DischargeCardRequestDto } from "./dto/discharge-request-card.dto";
import { FindAllCardByUserFiltersDto } from "./dto/find-all-card-by-user-filters.dto";
import { RechargeCardDto } from "./dto/recharge-card.dto";
import { UpdateCreditCardDto } from "./dto/update-credit-card.dto";
import {
  CardStatus,
  FindAllCardByUserService,
} from "./use-cases/find-all-card-by-user.service";

@Controller("card")
@UseGuards(AuthGuard(["api-key", "jwt"]))
export class CreditCardController {
  constructor(
    private readonly creditCardService: CreditCardService,
    private readonly findAllCardByUserService: FindAllCardByUserService
  ) {}

  @Post()
  create(
    @Req() request: AuthenticatedRequest,
    @Body() createCreditCardDto: CreateCreditCardDto
  ) {
    return this.creditCardService.create(
      createCreditCardDto,
      request.user.email
    );
  }

  @Post("new")
  createNewCard(
    @Req() request: AuthenticatedRequest,
    @Body() createCreditCardNewDto: CreateCreditCardNewDto
  ) {
    return this.creditCardService.createCardNew(
      createCreditCardNewDto,
      request.user.email
    );
  }

  @Post("create-off-flow")
  createCardOffFlow(@Body() createCardOffFlowDto: CreateCardOffFlowDto) {
    return this.creditCardService.createCardOffFlow(createCardOffFlowDto);
  }

  @Post("recharge")
  rechargeCard(@Body() rechargeCardDto: RechargeCardDto) {
    return this.creditCardService.rechargeCard(rechargeCardDto);
  }

  @Post("discharge")
  dischargeCard(@Body() dischargeCardRequestDto: DischargeCardRequestDto) {
    if (dischargeCardRequestDto.value > -99)
      throw new BadRequestException("It must be a value greater than -98");
    return this.creditCardService.dischargeCard(dischargeCardRequestDto);
  }

  @Get(":userId")
  findAll(
    @Param("userId") userId: string,
    @Query() { cardStatus }: FindAllCardByUserFiltersDto
  ) {
    return this.findAllCardByUserService.call(userId, cardStatus);
  }

  @Get("info/:cardId")
  findDetailsCard(@Param("cardId") cardId: string) {
    return this.creditCardService.findDetailCard(cardId);
  }

  @Get("movements/:cardId")
  movementsCard(@Param("cardId") cardId: string) {
    return this.creditCardService.movementsCard(cardId);
  }

  @Get("activate/:cardId")
  activateCard(@Param("cardId") cardId: string) {
    return this.creditCardService.activateCard(cardId);
  }

  @Get("block/:cardId")
  blockCard(@Param("cardId") cardId: string) {
    return this.creditCardService.blockCard(cardId);
  }

  @Get("unlock/:cardId")
  unlockCard(@Param("cardId") cardId: string) {
    return this.creditCardService.unlockCard(cardId);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateCreditCardDto: UpdateCreditCardDto
  ) {
    return this.creditCardService.update(id, updateCreditCardDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.creditCardService.remove(+id);
  }
}
