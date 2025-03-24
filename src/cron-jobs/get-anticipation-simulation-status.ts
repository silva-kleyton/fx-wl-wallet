import { Handler } from "aws-lambda";
import { GetAnticipationSimulationStatusUseCase } from "src/modules/request/application/usecases/get-anticipation-simulation-status.use-case";
import { RequestService } from "src/modules/request/request.service";
import { TransactionService } from "src/modules/transaction/transaction.service";
import { PrismaService } from "src/prisma/prisma.service";
import { RevenueAntecipationService } from "src/modules/revenue-antecipation/application/services/revenue-antecipation.service";
import { ReceiveAnticipationSimulationStatusUseCase } from "src/modules/request/application/usecases/receive-anticipation-simulation-status.use-case";
import { WalletService } from "src/modules/wallet/wallet.service";
import { ApproveRequestUseCase } from "src/modules/request/application/usecases/approve-request.usecase";
import { CreateRevenueAntecipationUsecase } from "src/modules/revenue-antecipation/application/use-cases/create-revenue-antecipation.usecase";
import { RequestWhiteListService } from "src/modules/request-white-list/application/services/request-white-list.service";
import { CreateAntecipationTransactionsUseCase } from "src/modules/revenue-antecipation/application/use-cases/create-antecipation-transactions.usecase";

const prismaService = new PrismaService();
const transactionService = new TransactionService(prismaService);
const revenueAntecipationService = new RevenueAntecipationService(
  prismaService,
);
const walletService = new WalletService(prismaService);
const requestService = new RequestService(
  prismaService,
  transactionService,
  revenueAntecipationService,
  walletService,
);
const requestWhiteListService = new RequestWhiteListService(prismaService);
const createAntecipationTransactionsUseCase =
  new CreateAntecipationTransactionsUseCase(
    transactionService,
    revenueAntecipationService,
    walletService,
    requestService,
    prismaService,
  );
const createRevenueAntecipationUsecase = new CreateRevenueAntecipationUsecase(
  transactionService,
  walletService,
  requestService,
  requestWhiteListService,
  createAntecipationTransactionsUseCase,
);
const approveRequestUseCase = new ApproveRequestUseCase(
  requestService,
  createRevenueAntecipationUsecase,
  walletService,
);
const receiveAnticipationSimulationStatusUseCase =
  new ReceiveAnticipationSimulationStatusUseCase(
    requestService,
    walletService,
    approveRequestUseCase,
  );
const getAnticipationSimulationStatusUseCase =
  new GetAnticipationSimulationStatusUseCase(
    requestService,
    receiveAnticipationSimulationStatusUseCase,
  );

export const handler: Handler = async () => {
  await getAnticipationSimulationStatusUseCase.execute();
};
