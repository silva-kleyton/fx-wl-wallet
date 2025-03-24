import { Module } from "@nestjs/common";
import { VolutiCredentialsController } from "./controllers/voluti-credentials.controller";
import { CrytoService } from "src/utils/crypto/crypto.service";
import { VolutiCredentialsService } from "./application/services/voluti-credentials.service";
import { UpsertVolutiCredentialsUseCase } from "./application/usecases/upsert-voluti-credentials.usecase";
import { ListVolutiCredentialsUseCase } from "./application/usecases/list-voluti-credentials.usecase";
import { VolutiService } from "../withdraw/application/services/voluti.service";
import { WalletService } from "../wallet/wallet.service";

@Module({
  controllers: [VolutiCredentialsController],
  providers: [
    UpsertVolutiCredentialsUseCase,
    ListVolutiCredentialsUseCase,
    VolutiCredentialsService,
    VolutiService,
    WalletService,
    CrytoService,
  ],
})
export class VolutiCredentialsModule {}
