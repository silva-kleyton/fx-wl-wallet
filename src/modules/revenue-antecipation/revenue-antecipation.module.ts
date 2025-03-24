import { Module } from "@nestjs/common";
import { RequestWhiteListService } from "../request-white-list/application/services/request-white-list.service";
import { RequestService } from "../request/request.service";
import { TransactionService } from "../transaction/transaction.service";
import { WalletService } from "../wallet/wallet.service";
import { RevenueAntecipationController } from "./adapters/controllers/revenue-antecipation.controller";
import { RevenueAntecipationService } from "./application/services/revenue-antecipation.service";
import { CreateRevenueAntecipationUsecase } from "./application/use-cases/create-revenue-antecipation.usecase";
import { CreateAntecipationTransactionsUseCase } from "./application/use-cases/create-antecipation-transactions.usecase";

@Module({
  controllers: [RevenueAntecipationController],
  providers: [
    CreateRevenueAntecipationUsecase,
    CreateAntecipationTransactionsUseCase,
    TransactionService,
    RevenueAntecipationService,
    WalletService,
    RequestService,
    RequestWhiteListService,
  ],
})
export class RevenueAntecipationModule {}
