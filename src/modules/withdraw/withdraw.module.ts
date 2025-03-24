import { Module } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CrytoService } from "../../utils/crypto/crypto.service";
import { RequestService } from "../request/request.service";
import { RevenueAntecipationService } from "../revenue-antecipation/application/services/revenue-antecipation.service";
import { TransactionService } from "../transaction/transaction.service";
import { TransfeeraCredentialsService } from "../transfeera-credentials/application/services/transfeera-credentials.service";
import { WalletService } from "../wallet/wallet.service";
import { WithDrawController } from "./adapters/controllers/withdraw.controller";
import { TransfeeraService } from "./application/services/transfeera.service";
import { WithdrawUseCase } from "./application/usecases/with-draw.usecase";
import { FinishWithdrawUseCase } from "./application/usecases/finish-with-draw.usecase";
import { VolutiService } from "./application/services/voluti.service";
import { VolutiCredentialsService } from "../voluti-credentials/application/services/voluti-credentials.service";

@Module({
  controllers: [WithDrawController],
  providers: [
    WithdrawUseCase,
    FinishWithdrawUseCase,
    TransfeeraService,
    VolutiService,
    WalletService,
    TransfeeraCredentialsService,
    VolutiCredentialsService,
    CrytoService,
    RequestService,
    TransactionService,
    RevenueAntecipationService,
    PrismaService,
  ],
})
export class WithDrawModule {}
