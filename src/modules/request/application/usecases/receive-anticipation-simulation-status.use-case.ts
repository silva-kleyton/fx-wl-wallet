import { Injectable } from "@nestjs/common";
import { RequestService } from "../../request.service";
import { WalletService } from "src/modules/wallet/wallet.service";
import { ApproveRequestUseCase } from "./approve-request.usecase";
import { Request } from "@prisma/client";

@Injectable()
class ReceiveAnticipationSimulationStatusUseCase {
  constructor(
    private requestService: RequestService,
    private walletService: WalletService,
    private approveRequestUseCase: ApproveRequestUseCase,
  ) {}

  async execute(body: {
    total_advance_fee_cents: number;
    reached_amount_cents: number;
    average_days: number;
    sellerId: string[];
    provider: string;
    request?: Request;
    status?: "done" | "error" | "processing";
    errorDescription?: string;
  }) {
    if (body.status === "processing") {
      return;
    }

    let request = body.request;

    if (!body.request) {
      request = await this.requestService.getAntecipationRequestsByUserId(
        body.sellerId,
      );
    }

    if (body.status === "error") {
      await this.requestService.updateAntecipationRequest(request.id, {
        status: "simulationFailed",
        errorDescription: body.errorDescription,
      });
      return;
    }

    const totalAmount = body.reached_amount_cents;
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

    await this.requestService.updateAntecipationRequest(request.id, {
      status: "waiting",
      valorDescount: totalAmount - tax,
      tax,
      acquirerTax: body.total_advance_fee_cents,
    });

    if (request.automaticPayment) {
      const wallet = await this.walletService.findWalletUser(request.userId);

      await this.approveRequestUseCase.execute({
        requestId: request.id,
        antecipation: {
          walletId: wallet.id,
        },
        automatic: request.automaticPayment,
        provider: body.provider,
      });
    }
  }
}

export { ReceiveAnticipationSimulationStatusUseCase };
