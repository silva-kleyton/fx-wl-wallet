import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";

import { CreateRequestWhiteListUseCase } from "../../application/use-cases/create-request-white-list.usecase";
import { EnableOrDisableWhiteListUsecase } from "../../application/use-cases/enable-or-disable-white-list.usecase";
import { RetrieveByIdWhiteListUsecase } from "../../application/use-cases/retrieve-by-id-white-list.usecase";
import { RetrieveAllRequestsListByAdminUseCase } from "../../application/use-cases/retrive-all-requests-list-by-admin.usecase";
import { CreateRequestWhiteListDTO } from "../dto/create-request-white-list.dto";
import { EnableOrDisableRequestWhiteListDTO } from "../dto/enable-or-disable-white-list.dto";

//@UseGuards(AuthGuard(["api-key", "jwt"]))
@Controller("request-white-list")
export class RequestWhiteListController {
  constructor(
    private readonly createRequestWhiteListUseCase: CreateRequestWhiteListUseCase,
    private readonly retrieveAllRequestsListByAdminUseCase: RetrieveAllRequestsListByAdminUseCase,
    private readonly retrieveByIdWhiteListUseCase: RetrieveByIdWhiteListUsecase,
    private readonly enableOrDisableRequestWhiteListUseCase: EnableOrDisableWhiteListUsecase,
  ) {}

  @Post("/create")
  async createRevenue(@Body() input: CreateRequestWhiteListDTO) {
    const revenueAntecipationOutput =
      await this.createRequestWhiteListUseCase.execute(input);
    return {
      data: revenueAntecipationOutput,
    };
  }
  @Get("/list/by-admin/:adminId")
  async listAllRequestWhiteListByAdmin(@Param("adminId") adminId: string) {
    const result =
      await this.retrieveAllRequestsListByAdminUseCase.execute(adminId);
    return {
      data: result,
    };
  }
  @Get("/list/by-id/:id")
  async listRequestWhiteListById(@Param("id") id: string) {
    const result = await this.retrieveByIdWhiteListUseCase.execute(id);
    return {
      data: result,
    };
  }

  @Patch("/enable-or-disable")
  async enableOrDisableRequestWhiteList(
    @Body() input: EnableOrDisableRequestWhiteListDTO,
  ) {
    const result =
      await this.enableOrDisableRequestWhiteListUseCase.execute(input);
    return {
      data: result,
    };
  }
}
