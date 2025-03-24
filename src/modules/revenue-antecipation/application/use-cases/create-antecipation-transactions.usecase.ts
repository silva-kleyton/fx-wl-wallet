import { Injectable } from "@nestjs/common";
import { RequestService } from "../../../../modules/request/request.service";
import { TransactionService } from "../../../../modules/transaction/transaction.service";
import { WalletService } from "../../../../modules/wallet/wallet.service";
import { RevenueAntecipationService } from "../services/revenue-antecipation.service";
import {
  EnumTypeTransaction,
  Request,
  Transactions,
  Wallet,
} from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
class CreateAntecipationTransactionsUseCase {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly revenueAntecipationService: RevenueAntecipationService,
    private readonly walletService: WalletService,
    private readonly requestService: RequestService,
    private readonly prismaService: PrismaService,
  ) {}

  async execute(input: {
    sellerWallet: Wallet;
    transactions: Transactions[];
    request: Request;
    acquirerTax?: number;
    saleId?: string;
  }) {
    try {
      const { sellerWallet, transactions } = input;

      const sellerAntecipationMoney = input.request.valorDescount;
      const totalValue = sellerAntecipationMoney + input.request.tax;

      let transactionsValue = 0;
      const transactionsToUpdate = [];
      for (const tr of transactions) {
        if (
          transactionsValue + (tr.value - (tr.antecipedAmount ?? 0)) <=
          totalValue
        ) {
          transactionsValue += tr.value - (tr.antecipedAmount ?? 0);
          transactionsToUpdate.push({
            id: tr.id,
            anteciped: true,
            antecipedAmount: tr.value,
          });
        } else {
          if (transactionsValue < totalValue) {
            const missingValue = totalValue - transactionsValue;
            transactionsValue += missingValue;
            transactionsToUpdate.push({
              id: tr.id,
              antecipedAmount: tr.antecipedAmount
                ? tr.antecipedAmount + missingValue
                : missingValue,
            });
          }
        }
      }

      const balanceDisponibility = await this.prismaService.$transaction(
        async (trx) => {
          const updatedSellerWallet =
            await this.createTransactionAndUpdateBalance({
              balanceDisponilibity: sellerWallet.balanceDisponilibity,
              saleId: input.saleId,
              trx,
              type: "debit",
              value: input.request.tax,
              valueDisponilibity: -input.request.tax,
              walletId: sellerWallet.id,
            });

          const platformProfit = input.request.tax - (input.acquirerTax ?? 0);
          const platformAdmintId = sellerWallet.adminId;
          const platformWallet =
            await this.walletService.findWalletUser(platformAdmintId);

          await this.createTransactionAndUpdateBalance({
            balanceDisponilibity: platformWallet.balanceDisponilibity,
            saleId: input.saleId,
            trx,
            type: platformProfit > 0 ? "deposit" : "debit",
            value: platformProfit,
            valueDisponilibity: platformProfit,
            walletId: platformWallet.id,
          });

          let acquirerWallet: Wallet = await this.walletService.findWalletUser(
            `acquirer-${platformAdmintId}`,
          );

          if (!acquirerWallet) {
            acquirerWallet = await this.prismaService.wallet.create({
              data: {
                user: `acquirer-${platformAdmintId}`,
                isAdmin: true,
              },
            });
          }

          await this.createTransactionAndUpdateBalance({
            balanceDisponilibity: acquirerWallet.balanceDisponilibity,
            saleId: input.saleId,
            trx,
            type: "deposit",
            value: input.acquirerTax,
            valueDisponilibity: input.acquirerTax,
            walletId: acquirerWallet.id,
          });

          for (const transaction of transactionsToUpdate) {
            await this.transactionService.update(
              transaction.id,
              {
                antecipedAmount: transaction.antecipedAmount,
                ...(transaction.anteciped && {
                  anteciped: transaction.anteciped,
                }),
              },
              trx,
            );
            console.log("update to ateciped");
          }

          await this.requestService.updateAntecipationRequest(
            input.request.id,
            {
              status: "done",
            },
            trx,
          );

          return {
            balanceDisponibility: updatedSellerWallet.balanceDisponilibity,
          };
        },
        {
          timeout: 10000,
        },
      );

      return { balanceDisponibility };
    } catch (error) {
      console.log("Error on CreateAntecipationTransactionsUseCase ", error);
      throw error;
    }
  }

  private async createTransactionAndUpdateBalance(input: {
    type: EnumTypeTransaction;
    value: number;
    valueDisponilibity: number;
    saleId: string;
    walletId: string;
    balanceDisponilibity: number;
    trx: any;
  }): Promise<Wallet> {
    const createTransaction = await this.transactionService.create(
      {
        type: input.type,
        typeInput: "antecipation",
        value: input.valueDisponilibity,
        date: new Date(),
        walletId: input.walletId,
        description: "Taxa de Antecipação",
        valueDisponilibity: input.valueDisponilibity,
        saleId: input.saleId,
      },
      input.trx,
    );
    if (!createTransaction) {
      throw "Error to create the transaction";
    }

    const updatedWallet = await this.walletService.update(
      input.walletId,
      {
        balanceDisponilibity:
          input.balanceDisponilibity + input.valueDisponilibity,
      },
      input.trx,
    );

    const balanceHistory =
      await this.revenueAntecipationService.createBalanceHistory(
        {
          balanceDisponilibity: updatedWallet.balanceDisponilibity,
          transactionId: createTransaction.id,
        },
        input.trx,
      );
    if (!balanceHistory) throw "Error to create the balance history";

    return updatedWallet;
  }
}
export { CreateAntecipationTransactionsUseCase };
