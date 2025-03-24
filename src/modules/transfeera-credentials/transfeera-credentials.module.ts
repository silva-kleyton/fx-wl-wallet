import { Module } from "@nestjs/common";
import { CrytoService } from "../../utils/crypto/crypto.service";
import { TransfeeraCredentialsService } from "./application/services/transfeera-credentials.service";
import { CreateTransfeeraCredentialsUsecase } from "./application/usecases/create-transfeera-credentials.usecase";
import { DeleteTransfeeraCredentialsUseCase } from "./application/usecases/delete-transfeera-credentials.usecase";
import { ListTransfeeraCredentialsUseCase } from "./application/usecases/list-transfeera-credentials.usecase";
import { UpdateTransfeeraCredentialsUseCase } from "./application/usecases/update-transfeera-credentials.usecase";
import { TransferaCredentialsController } from "./controllers/transfeera-credentials.controller";
@Module({
  controllers: [TransferaCredentialsController],
  providers: [
    CreateTransfeeraCredentialsUsecase,
    UpdateTransfeeraCredentialsUseCase,
    ListTransfeeraCredentialsUseCase,
    DeleteTransfeeraCredentialsUseCase,
    TransfeeraCredentialsService,
    CrytoService,
  ],
})
export class TransfeeraCredentialsModule {}
