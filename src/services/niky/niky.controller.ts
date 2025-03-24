import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  UseGuards,
} from "@nestjs/common";
import { NikyService } from "./niky.service";
import { CreateRechargeDto } from "./dto/create-recharge.dto";
import { CreateDischargeDto } from "./dto/create-discharge.dto";
import { CreateLotOfCardsDto } from "./dto/create-lot-of-cards.dto";
import { UnlinkCardsDto } from "./dto/unlink-cards.dto";
import { UpdateBearerDataDto } from "./dto/update-bearer-data.dto";
import { BlockCardDto } from "./dto/block-card.dto";
import { UpdateChargeStatusDto } from "./dto/update-charge-status.dto";
import { UpdateDischargeStatusDto } from "./dto/update-discharge-status.dto";
import { CreateCardNikyDto } from "./dto/create-card.dto";
import { CreateCardBrokerDto } from "./dto/create-card-broker.dto";
import { AuthGuard } from "@nestjs/passport";

@Controller("niky")
@UseGuards(AuthGuard(["api-key", "jwt"]))
export class NikyController {
  constructor(private readonly nikyService: NikyService) {}

  @Get()
  authenticate() {
    return this.nikyService.authenticate();
  }

  @Post("create-card")
  createCard(@Body() createCard: CreateCardNikyDto) {
    return this.nikyService.createCard(createCard);
  }

  // @Post("create-card/broker")
  // createCardBroker(@Body() createCard: CreateCardBrokerDto) {
  //   return this.nikyService.createCardBroker(createCard);
  // }

  @Post("create-recharge")
  createRecharge(@Body() createRechargeDto: CreateRechargeDto) {
    return this.nikyService.createRecharge(createRechargeDto);
  }

  @Get("list-recharges")
  listRecharges() {
    return this.nikyService.listRecharges();
  }

  @Put("cancel-recharge/:id")
  cancelRecharge(@Param("id") rechargeId: string) {
    return this.nikyService.cancelRecharge(rechargeId);
  }

  @Get("list-details-recharge/:id")
  listDetailsRecharge(@Param("id") rechargeId: string) {
    return this.nikyService.listDetailsRecharge(rechargeId);
  }

  @Get("list-items-recharge")
  listItensRecharge() {
    return this.nikyService.listItensRecharge();
  }

  @Post("create-discharge")
  createDischarge(@Body() createDischargeDto: CreateDischargeDto) {
    return this.nikyService.createDischarge(createDischargeDto);
  }

  @Get("list-discharges")
  listDischarges() {
    return this.nikyService.listDischarges();
  }

  @Put("cancel-discharge/:id")
  cancelDischarge(@Param("id") dischargeId: string) {
    return this.nikyService.cancelDischarge(dischargeId);
  }

  @Get("list-details-discharge/:id")
  listDetailsDischarge(@Param("id") dischargeId: string) {
    return this.nikyService.listDetailsDischarge(dischargeId);
  }

  @Get("list-items-discharge")
  listItemsDischarge() {
    return this.nikyService.listItemsDischarge();
  }

  @Post("create-lot-of-cards")
  createLotOfCards(@Body() createLotOfCardsDto: CreateLotOfCardsDto) {
    return this.nikyService.createLotOfCards(createLotOfCardsDto);
  }

  @Get("list-lot-of-cards")
  listLotOfCards() {
    return this.nikyService.listLotOfCards();
  }

  @Put("cancel-lot-of-cards/:id")
  cancelLotOfCards(@Param("id") lotOfCardsId: string) {
    return this.nikyService.cancelLotOfCards(lotOfCardsId);
  }

  @Post("unlink-card")
  unlinkCard(@Body() unlinkCardsDto: UnlinkCardsDto) {
    return this.nikyService.unlinkCard(unlinkCardsDto);
  }

  @Get("list-unlink-card")
  listUnlinkCard() {
    return this.nikyService.listUnlinkCard();
  }

  @Put("cancel-unlink-card/:id")
  cancelUnlinkCard(@Param("id") unlinkCardId: string) {
    return this.nikyService.cancelUnlinkCard(unlinkCardId);
  }

  @Post("update-bearer-data/:id")
  updateBearerData(
    @Param("id") cardId: string,
    @Body() updateBearerDataDto: UpdateBearerDataDto
  ) {
    return this.nikyService.updateBearerData(cardId, updateBearerDataDto);
  }

  @Put("unlock-card/:id")
  unlockCard(@Param("id") cardId: string) {
    return this.nikyService.unlockCard(cardId);
  }

  // @Put("block-card/:id")
  // blockCard(@Param("id") cardId: string, @Body() blockCardDto: BlockCardDto) {
  //   return this.nikyService.blockCard(cardId, blockCardDto);
  // }

  @Get("list-card-inforation/:id")
  listCardInforation(@Param("id") cpfPortador: string) {
    return this.nikyService.listCardInformation(cpfPortador);
  }

  @Get("consult-movements/:id")
  consultMovements(@Param("id") cardId: string) {
    return this.nikyService.consultMovementsCard(cardId);
  }

  @Put("update-charge-status")
  updateChargeStatus(@Body() updateChargeStatusDto: UpdateChargeStatusDto) {
    return this.nikyService.updateChargeStatus(updateChargeStatusDto);
  }

  @Put("update-discharge-status")
  updateDischargeStatus(
    @Body() updateDischargeStatusDto: UpdateDischargeStatusDto
  ) {
    return this.nikyService.updateDischargeStatus(updateDischargeStatusDto);
  }
}
