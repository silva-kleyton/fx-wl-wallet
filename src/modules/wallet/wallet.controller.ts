import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { PaginationParams } from "../../utils/paginations/dto/paginationParams";
import { CreateWalletDto } from "./dto/create-wallet.dto";
import { WalletService } from "./wallet.service";

@UseGuards(AuthGuard(["api-key", "jwt"]))
@Controller("wallet")
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  create(@Body() createWalletDto: CreateWalletDto) {
    return this.walletService.create(createWalletDto);
  }

  @Get()
  findAll(@Param("id") id: string, @Query() { page, limit }: PaginationParams) {
    const pagination: PaginationParams =
      page && limit ? { page: Number(page), limit: Number(limit) } : undefined;

    return this.walletService.findAll(id, pagination);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.walletService.findOne(id);
  }

  @Get("user/:id")
  findWalletUser(@Param("id") id: string) {
    return this.walletService.findWalletUser(id, false);
  }

  @Get("comissions/:id")
  getCommissions(@Param("id") id: string) {
    return this.walletService.getComissionsSale(id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.walletService.remove(id);
  }
}
