import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Response } from "express";
import { CreateRevenueAntecipationDto } from "../revenue-antecipation/adapters/dto/create-revenue-antecipation.dto";
import { ApproveRequestUseCase } from "./application/usecases/approve-request.usecase";
import { ListRequestByAdminDTO } from "./dto/list-request-by-admin.dto";
import { WithdrawRequestDto } from "./dto/withdraw-request.dto";
import { RequestService } from "./request.service";
import { ApprovedWithDrawnRequestDTO } from "./dto/approved-request.dto";
import { CreateAntecipationTransactionsUseCase } from "../revenue-antecipation/application/use-cases/create-antecipation-transactions.usecase";
import { WalletService } from "../wallet/wallet.service";
import { TransactionService } from "../transaction/transaction.service";
import { ReceiveAnticipationSimulationStatusUseCase } from "./application/usecases/receive-anticipation-simulation-status.use-case";

@UseGuards(AuthGuard(["api-key"]))
@Controller("request")
export class RequestController {
  constructor(
    private requestService: RequestService,
    private walletService: WalletService,
    private transactionService: TransactionService,
    private approveRequestUseCase: ApproveRequestUseCase,
    private readonly createAntecipationTransactionsUseCase: CreateAntecipationTransactionsUseCase,
    private readonly receiveAnticipationSimulationStatusUseCase: ReceiveAnticipationSimulationStatusUseCase,
  ) {}
  @Get("/:userId")
  public async listRequests(
    @Param("userId") userId: string,
    @Query("type") type: "withdraw" | "antecipation",
  ) {
    return this.requestService.listRequests(userId, type);
  }

  @Get("withdraw/byadmin/:id")
  public async listWithdrawRequestByAdmin(
    @Param("id") adminId: string,
    @Query() { page, perPage }: { page?: string; perPage?: string },
  ) {
    return await this.requestService.listWithdrawRequestByAdmin(
      adminId,
      Number(page),
      Number(perPage),
    );
  }

  @Get("antecipation/byadmin/:id")
  public async listAntecipationRequestByAdmin(
    @Param("id") adminId: string,
    @Query() { page, perPage }: { page?: string; perPage?: string },
  ) {
    return await this.requestService.listAntecipationRequestByAdmin(
      adminId,
      Number(page),
      Number(perPage),
    );
  }

  @Post("/withdraw/:userId")
  public async createWithdrawRequest(
    @Param("userId") userId: string,
    @Body() body: WithdrawRequestDto,
    @Res() res: Response,
  ) {
    const result = await this.requestService.createWithdrawRequest(
      userId,
      body,
    );
    if (result.hasOwnProperty("error")) {
      return res.status(400).send(result);
    }
    return res.status(200).send(result);
  }

  @Get("byadmin/:id")
  public async listRequestByAdmin(
    @Param("id") adminId: string,
    @Query() { tax_per_installment }: ListRequestByAdminDTO,
  ) {
    return await this.requestService.listRequestByAdmin(adminId, {
      tax_per_installment,
    });
  }

  @Post("antecipation")
  public async createAntecipationRequest(
    @Body() body: any,
    @Res() res: Response,
  ) {
    const result = await this.requestService.createAntecipationRequest(body);
    if (result.hasOwnProperty("error")) {
      return res.status(400).send(result);
    }
    return res.status(200).send(result);
  }

  @Post("antecipation/simulation/status")
  public async receiveAntecipationSimulationStatus(
    @Body()
    body: {
      total_advance_fee_cents: number;
      reached_amount_cents: number;
      average_days: number;
      available_amount_cents: number;
      simulation_amount_cents: number;
      requested_amount_cents: number;
      sellerId: string[];
      provider: string;
    },
    @Res() res: Response,
  ) {
    console.log("body", body);
    await this.receiveAnticipationSimulationStatusUseCase.execute(body);

    return res.status(200).send({});
  }

  @Post("antecipation/approve/status")
  public async receiveAntecipationApproveStatus(
    @Body()
    body: {
      status: "error" | "done";
      total_advance_fee_cents: number;
      total_advance_amount_cents: number;
      advancement_request_date: string;
      transaction_ids: string;
      account_id: string;
      idempotencyKey: string;
      sellerId: string[];
      provider: string;
    },
    @Res() res: Response,
  ) {
    try {
      console.log("body", body);
      const request =
        await this.requestService.getAprovedAntecipationRequestsByUserId(
          body.sellerId,
        );

      console.log("request ", request);

      if (body.status === "error") {
        await this.requestService.updateAntecipationRequest(request.id, {
          status: "failed",
        });
        return res.status(200).send({});
      }

      const totalAmount = body.total_advance_amount_cents;
      let tax = 0;
      if (request.taxFixed && request.taxVariabel) {
        tax = Math.round(
          request.taxFixed + totalAmount * (request.taxVariabel / 100),
        );
      } else if (request.taxFixed) {
        tax = request.taxFixed;
      } else if (request.taxVariabel) {
        tax = Math.round(totalAmount * (request.taxVariabel / 100));
      }

      const updatedRequest =
        await this.requestService.updateAntecipationRequest(request.id, {
          valorDescount: totalAmount - tax,
          tax,
          acquirerTax: body.total_advance_fee_cents,
        });

      const wallet = await this.walletService.findWalletUser(request.userId);
      console.log("wallet ", wallet);

      const transactions =
        body.provider === "iugu"
          ? []
          : await this.transactionService.getTransactionStartTomorrow(
              wallet.id,
              request.lastTransactionDate,
            );

      await this.createAntecipationTransactionsUseCase.execute({
        request: updatedRequest,
        sellerWallet: wallet,
        transactions,
        acquirerTax: body.total_advance_fee_cents,
        saleId: body.idempotencyKey,
      });
      return res.status(200).send({
        success: true,
        adminTax: tax - body.total_advance_fee_cents,
      });
    } catch (error) {
      console.log("Error on receiveAntecipationApproveStatus ", error);
      return res.status(500).send();
    }
  }

  @Patch("antecipation/unapprove/:id")
  public async unapproveAntecipationRequest(@Param("id") id: string) {
    return await this.requestService.updateAntecipationRequest(id, {
      status: "denied",
    });
  }

  @Patch("antecipation/:id")
  public async updateAntecipationRequest(
    @Param("id") id: string,
    @Body() body: CreateRevenueAntecipationDto,
  ) {
    return await this.approveRequestUseCase.execute({
      requestId: id,
      antecipation: body,
      automatic: body.automatic,
      provider: body.provider,
    });
  }
  @Patch("/approve/withdraw/:id")
  public async approveWithDrawRequest(
    @Param("id") id: string,
    @Body() body: ApprovedWithDrawnRequestDTO,
  ) {
    return this.requestService.updateAntecipationRequest(id, {
      status: body.automatic ? "autoAproved" : "aproved",
    });
  }
  @Patch("/unapprove/withdraw/:id")
  public async unapproveWithDrawRequest(@Param("id") id: string) {
    return await this.requestService.updateAntecipationRequest(id, {
      status: "denied",
    });
  }
}
