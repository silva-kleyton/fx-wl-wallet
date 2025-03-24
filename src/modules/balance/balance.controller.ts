import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { BalanceService } from "./balance.service";
import { CreateBalanceDto } from "./dto/create-balance.dto";
import { UpdateBalanceDto } from "./dto/update-balance.dto";
import { InputTransactionWalletDto } from "./dto/input-transaction-wallet.dto";

@UseGuards(AuthGuard(["api-key", "jwt"]))
@Controller("balance")
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  // @Post("add")
  // create(@Body() createBalanceDto: CreateBalanceDto) {
  //   return this.balanceService.addWalletBalanceForSaleAndCommission(
  //     createBalanceDto-
  //   );
  // }

  // @Post("add")
  // create(@Body() createBalanceDto: InputTransactionWalletDto) {
  //   return this.balanceService.inputTransactionWallet(createBalanceDto);
  // }

  @Get()
  findAll() {
    return this.balanceService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.balanceService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateBalanceDto: UpdateBalanceDto) {
    return this.balanceService.update(+id, updateBalanceDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.balanceService.remove(+id);
  }
}
