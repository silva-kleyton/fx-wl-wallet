import { Module } from "@nestjs/common";
import { RequestWhiteListController } from "./adapters/controller/request-white-list.controller";
import { RequestWhiteListService } from "./application/services/request-white-list.service";
import { CreateRequestWhiteListUseCase } from "./application/use-cases/create-request-white-list.usecase";
import { EnableOrDisableWhiteListUsecase } from "./application/use-cases/enable-or-disable-white-list.usecase";
import { RetrieveByIdWhiteListUsecase } from "./application/use-cases/retrieve-by-id-white-list.usecase";
import { RetrieveAllRequestsListByAdminUseCase } from "./application/use-cases/retrive-all-requests-list-by-admin.usecase";
@Module({
  controllers: [RequestWhiteListController],
  providers: [
    CreateRequestWhiteListUseCase,
    RetrieveAllRequestsListByAdminUseCase,
    RetrieveByIdWhiteListUsecase,
    EnableOrDisableWhiteListUsecase,
    RequestWhiteListService,
  ],
})
export class RequestWhiteListModule {}
