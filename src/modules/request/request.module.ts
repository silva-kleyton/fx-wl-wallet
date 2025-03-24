import { Module } from "@nestjs/common";
import { RequestWhiteListService } from "../request-white-list/application/services/request-white-list.service";
import { RevenueAntecipationService } from "../revenue-antecipation/application/services/revenue-antecipation.service";
import { CreateRevenueAntecipationUsecase } from "../revenue-antecipation/application/use-cases/create-revenue-antecipation.usecase";
import { TransactionService } from "../transaction/transaction.service";
import { WalletService } from "../wallet/wallet.service";
import { ApproveRequestUseCase } from "./application/usecases/approve-request.usecase";
import { RequestController } from "./request.controller";
import { RequestService } from "./request.service";
import { CreateAntecipationTransactionsUseCase } from "../revenue-antecipation/application/use-cases/create-antecipation-transactions.usecase";
import { ReceiveAnticipationSimulationStatusUseCase } from "./application/usecases/receive-anticipation-simulation-status.use-case";
import { GetAnticipationSimulationStatusUseCase } from "./application/usecases/get-anticipation-simulation-status.use-case";

@Module({
  controllers: [RequestController],
  providers: [
    ApproveRequestUseCase,
    CreateRevenueAntecipationUsecase,
    CreateAntecipationTransactionsUseCase,
    TransactionService,
    RevenueAntecipationService,
    RequestService,
    WalletService,
    RequestWhiteListService,
    ReceiveAnticipationSimulationStatusUseCase,
    GetAnticipationSimulationStatusUseCase,
  ],
})
export class RequestModule {}
