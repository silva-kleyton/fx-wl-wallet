import { Injectable } from "@nestjs/common";
import { differenceInMonths } from "date-fns";
import { PrismaService } from "../../../../prisma/prisma.service";
import { CreateBalanceHistoryDTO } from "../../adapters/dto/create-balance-history.dto";
import { PrismaClient } from "@prisma/client";

@Injectable()
class RevenueAntecipationService {
  constructor(private prismaService: PrismaService) {}
  async getTaxBaseadOnInstallements(
    transactions: Array<any>,
    tax_per_installment: number,
  ) {
    //Get the more advanced  date in future on  date field of transactions array
    const majorDate = transactions.reduce((acc, transaction) => {
      if (acc.date < transaction.date) {
        acc = transaction;
      }
      return acc;
    }, []);

    const TAX = tax_per_installment;
    //Discovery the number of installments basead on the difference between the major date and the current date
    const installments =
      differenceInMonths(majorDate.date, new Date()) > 0
        ? differenceInMonths(majorDate.date, new Date())
        : 1;
    return TAX * installments;
  }

  async createBalanceHistory(input: CreateBalanceHistoryDTO, trx?: any) {
    const { balanceDisponilibity, transactionId } = input;
    const client: PrismaClient = trx ?? this.prismaService;
    return await client.balanceHistory.create({
      data: {
        balanceBlocked: 0,
        balanceToRelease: input.balanceToRelease || 0,
        balanceDisponilibity,
        transactionId,
      },
    });
  }
}

export { RevenueAntecipationService };
