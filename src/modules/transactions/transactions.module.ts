import { Module } from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { TransactionsController } from "./transactions.controller";
import { PrismaService } from "../../prisma/prisma.service";
import { CoreService } from "../../services/core/core.service";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [
    HttpModule.register({
      baseURL: `${process.env.BASE_URL_CORE}`,
      headers: {
        "Content-Type": "application/json",
        "api-key": `${process.env.API_KEY_CORE}`,
      },
    }),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, PrismaService, CoreService],
})
export class TransactionsModule {}