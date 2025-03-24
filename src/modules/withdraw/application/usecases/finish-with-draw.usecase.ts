import { Injectable } from "@nestjs/common";
import { RequestService } from "../../../request/request.service";
import { WalletService } from "../../../wallet/wallet.service";
import { PrismaService } from "src/prisma/prisma.service";
import { TransactionService } from "src/modules/transaction/transaction.service";
import { InputFinishWithdraw } from "../../adapters/dto/finish-withdraw.dto";

@Injectable()
class FinishWithdrawUseCase {
  constructor(
    private walletService: WalletService,
    private requestService: RequestService,
    private readonly transactionService: TransactionService,

    private readonly prismaService: PrismaService,
  ) {}

  async execute(input: InputFinishWithdraw): Promise<any> {
    console.log("FinishWithdrawUseCase input ", input);
    const request = await this.requestService.getWithdrawByExternalId(
      input.endToEndId,
    );
    if (!request || !["aproved", "autoAproved"].includes(request.status)) {
      throw new Error("The withdraw was not approved");
    }

    const walletBeforeUpdate = await this.walletService.findWalletUser(
      request.userId,
    );
    if (!walletBeforeUpdate) {
      throw new Error("Wallet not found");
    }

    if (input.status !== "LIQUIDATED") {
      return this.requestService.updateAntecipationRequest(request.id, {
        status: "denied",
        errorDescription: input.status,
      });
    }

    try {
      //To update the wallet balance
      const walletUpdated = await this.prismaService.$transaction(
        async (trx) => {
          await this.transactionService.create(
            {
              type: "debit",
              typeInput: "withdrawal",
              value: request.valorRequest,
              valueDisponilibity: -request.valorRequest,
              date: new Date(),
              walletId: walletBeforeUpdate.id,
            },
            trx,
          );

          const walletUpdated = await this.walletService.update(
            walletBeforeUpdate.id,
            {
              balanceDisponilibity:
                walletBeforeUpdate.balanceDisponilibity - request.valorRequest,
            },
            trx,
          );

          const adminWallet = await this.walletService.findWalletUser(
            walletBeforeUpdate.adminId,
          );
          if (adminWallet) {
            await this.transactionService.create(
              {
                type: "deposit",
                typeInput: "withdrawal",
                valueDisponilibity: request.tax,
                value: request.tax,
                date: new Date(),
                walletId: adminWallet.id,
              },
              trx,
            );

            await this.walletService.update(
              adminWallet.id,
              {
                balanceDisponilibity:
                  adminWallet.balanceDisponilibity + request.tax,
              },
              trx,
            );
          }

          await this.requestService.updateAntecipationRequest(request.id, {
            status: "done",
          });

          return walletUpdated;
        },
        {
          timeout: 15000,
        },
      );
      return { data: walletUpdated };
    } catch (error) {
      console.log("Error on FinishWithdrawUseCase ", error);
      throw error;
    }
  }
}
export { FinishWithdrawUseCase };
