import { Injectable } from "@nestjs/common";
import { Prisma, PrismaClient, Transactions } from "@prisma/client";
import { addDays, addMonths } from "date-fns";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
class TransactionService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: Prisma.TransactionsUncheckedCreateInput, trx?: any) {
    const client: PrismaClient = trx ?? this.prismaService;
    const transaction = await client.transactions.create({
      data,
    });
    return transaction;
  }
  async updateAnteciped(id: string) {
    const transaction = await this.prismaService.transactions.update({
      where: { id },
      data: {
        anteciped: true,
      },
    });
    return transaction;
  }
  async update(id: string, dataToUpdate: Partial<Transactions>, trx?: any) {
    const client: PrismaClient = trx ?? this.prismaService;
    const transaction = await client.transactions.update({
      where: { id },
      data: {
        ...dataToUpdate,
      },
    });
    return transaction;
  }
  async getTransactionFromNextMonth(walletId: string) {
    const startNextMonth = addMonths(new Date(), 1);
    startNextMonth.setDate(1);
    const transactions = await this.prismaService.transactions.findMany({
      where: {
        walletId,
        type: "deposit",
        typeInput: "sellerCommission",
        anteciped: false,
        dateUnlock: {
          gte: startNextMonth,
        },
      },
    });
    return transactions;
  }
  async getTransactionStartTomorrow(walletId: string, lastDate?: Date) {
    const startNextDay = addDays(new Date(), 1);
    const transactions = await this.prismaService.transactions.findMany({
      where: {
        walletId,
        type: "deposit",
        typeInput: "sellerCommission",
        anteciped: false,
        dateUnlock: {
          gte: startNextDay,
        },
        ...(lastDate && {
          createdAt: {
            lte: lastDate,
          },
        }),
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return transactions;
  }
}

export { TransactionService };
