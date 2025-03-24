import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  EnumRequestStatusAntecipation,
  EnumTypeInput,
  Prisma,
} from "@prisma/client";
import * as crypto from "crypto";
import { addDays, startOfDay, subDays, endOfDay, addHours } from "date-fns";
import { Producer } from "sqs-producer";
import { PrismaService } from "../../prisma/prisma.service";
import { CoreService } from "../../services/core/core.service";
import { calcPercentage } from "../../utils/convert/calc-percentage";
import { PaginationParams } from "../../utils/paginations/dto/paginationParams";
import { paginateResponse } from "../../utils/paginations/pagination-response";
import { CreateManualTransactionDTO } from "./dto/create-manual-transaction.dto";
import { OptionsParamsTransactions } from "./dto/optional-params-transactions.dto";
import { WithdrawRequestBodyDto } from "./dto/withdraw-request-body.dto";

@Injectable()
export class TransactionsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly coreService: CoreService,
  ) {}

  async withdraw({
    requestId,
  }: WithdrawRequestBodyDto & { userId: string }): Promise<void> {
    // const wallet = await this.prismaService.wallet.findFirst({
    //   where: { user: userId },
    // });

    const request = await this.prismaService.request.findFirst({
      where: { id: requestId },
    });

    if (request.status === EnumRequestStatusAntecipation.denied) {
      throw new BadRequestException(
        {
          mesage: "Requisição foi negada",
          error: "Request was denied",
        },
        "Requisição foi negada",
      );
    }

    await this.prismaService.$transaction([
      // TODO: Do I need to update any more values? @Maicon
      // `Use BackofficeService.confirmedWidthraw`
      // OR
      // this.prismaService.wallet.update({
      //   where: { id: wallet.id },
      //   data: {
      //     balance: wallet.balance - amount,
      //   },
      // }),
      this.prismaService.request.update({
        where: { id: request.id },
        data: {
          closed: true,
          status: EnumRequestStatusAntecipation.aproved,
        },
      }),
    ]);

    // FIXME: Implement pix transfer

    return;
  }

  async searchTransaction(startDay: Date, endDay: Date, userID: string) {
    const Data = await this.prismaService.transactions.findMany({
      where: {
        wallet: {
          user: userID,
        },
        dateUnlock: {
          gte: startDay,
          lte: endDay,
        },
        anteciped: false,
        request: null,
        AND: {
          OR: [
            {
              typeInput: EnumTypeInput.affiliationCommission,
            },
            {
              typeInput: EnumTypeInput.salesCommission,
            },
            {
              typeInput: EnumTypeInput.sallerCommission360,
            },
          ],
        },
      },
    });

    return Data.reduce((acc, value) => {
      acc += value.value;
      return acc;
    }, 0);
  }

  async findTransaction(userID: string) {
    const currentDate = new Date();
    const { fourteenDescount, thirtyDescount } =
      await this.coreService.requestAdvance(userID);

    const beforeYesterday = subDays(currentDate, 2);
    const daySelectFourteen = addDays(beforeYesterday, 14);
    const dayFifteen = addDays(daySelectFourteen, 1);
    const daySelectThirty = addDays(beforeYesterday, 30);

    const saleFourTeen = await this.searchTransaction(
      beforeYesterday,
      daySelectFourteen,
      userID,
    );

    const seleThirty = await this.searchTransaction(
      dayFifteen,
      daySelectThirty,
      userID,
    );

    if (!seleThirty && !saleFourTeen) {
      throw new NotFoundException({
        message: "user not antecipation",
      });
    }

    const descontFourteenRelease = calcPercentage(
      saleFourTeen,
      fourteenDescount,
    );

    const finalValueFourteen = saleFourTeen - descontFourteenRelease;

    const descontThirtyRelease = calcPercentage(seleThirty, thirtyDescount);

    const finalValueThirty = seleThirty - descontThirtyRelease;

    const descountValueAntecipation = finalValueFourteen + finalValueThirty;

    return {
      fourteen: {
        total: saleFourTeen,
        valueDescount: finalValueFourteen,
      },
      thirty: {
        total: seleThirty,
        valueDescount: finalValueThirty,
      },
      totalAccount: {
        total: saleFourTeen + seleThirty,
        valueDescount: descountValueAntecipation,
      },
    };
  }

  async findAll(
    userId: string,
    pagination?: PaginationParams,
    optionalParams?: OptionsParamsTransactions,
  ) {
    const startDate = optionalParams.startAt
      ? addHours(startOfDay(optionalParams.startAt), 3)
      : undefined;
    console.log("startDate ", startDate);
    const endDate = optionalParams.endAt
      ? addHours(endOfDay(optionalParams.endAt), 3)
      : undefined;
    console.log("endDate ", endDate);
    const codeSearch = optionalParams?.code?.trim() ?? undefined;
    const typeSearch = optionalParams?.type ?? undefined;
    const typeInputSearch = optionalParams?.typeInput ?? undefined;

    const wallet = await this.prismaService.wallet.findUnique({
      where: {
        user: userId,
      },
    });

    const query: Prisma.TransactionsWhereInput = {
      ...(optionalParams.balance && {
        OR: [
          {
            [optionalParams.balance]: { lt: 0 },
          },
          {
            [optionalParams.balance]: {
              gt: 0,
            },
          },
        ],
      }),
      walletId: wallet.id,
      ...((startDate || endDate) && {
        createdAt: {
          ...(startDate && {
            gte: startDate,
          }),
          ...(endDate && {
            lte: endDate,
          }),
        },
      }),
      code: codeSearch ? { contains: `${codeSearch}` } : undefined,
      type: typeSearch,
      typeInput: typeInputSearch,
    };

    if (pagination) {
      const { limit, page } = pagination;

      const data = await this.prismaService.$transaction([
        this.prismaService.transactions.count({
          where: query,
        }),
        this.getQueryRaw({
          valueType: optionalParams.balance,
          walletId: wallet.id,
          startDate,
          endDate,
          typeSearch,
          typeInputSearch,
          codeSearch,
          pagination,
        }),
      ]);

      return paginateResponse(data, page, limit);
    }

    return await this.getQueryRaw({
      valueType: optionalParams.balance,
      walletId: wallet.id,
      startDate,
      endDate,
      typeSearch,
      typeInputSearch,
      codeSearch,
    });
  }

  private getQueryRaw({
    valueType,
    walletId,
    startDate,
    endDate,
    typeSearch,
    typeInputSearch,
    codeSearch,
    pagination,
  }: {
    pagination?: PaginationParams;
    valueType?: string;
    walletId?: string;
    startDate?: Date;
    endDate?: Date;
    typeSearch?: string;
    typeInputSearch?: string;
    codeSearch?: string;
  }) {
    return this.prismaService.$queryRaw`
      SELECT
        "id",
        "date",
        "typeInput",
        "value",
        "valueDisponilibity",
        "valueReserved",
        "valueToRelease",
        "code",
        "createdAt",
        "type",
        "description",
        ${valueType === "valueToRelease" ? Prisma.sql`CAST(SUM("valueToRelease") OVER(order by "createdAt" asc rows unbounded preceding) AS INTEGER) AS balance` : Prisma.empty}
        ${valueType === "valueReserved" ? Prisma.sql`CAST(SUM("valueReserved") OVER(order by "createdAt" asc rows unbounded preceding) AS INTEGER) AS balance` : Prisma.empty}
        ${valueType === "valueDisponilibity" ? Prisma.sql`CAST(SUM("valueDisponilibity") OVER(order by "createdAt" asc rows unbounded preceding) AS INTEGER) AS balance` : Prisma.empty}
      FROM "Transactions"
      WHERE
        "walletId" = ${walletId}
        ${valueType === "valueToRelease" ? Prisma.sql`AND "valueToRelease" <> 0` : Prisma.empty}
        ${valueType === "valueReserved" ? Prisma.sql`AND "valueReserved" <> 0` : Prisma.empty}
        ${valueType === "valueDisponilibity" ? Prisma.sql`AND "valueDisponilibity" <> 0` : Prisma.empty}
        ${startDate ? Prisma.sql`AND "createdAt" >= ${startDate}` : Prisma.empty}
        ${endDate ? Prisma.sql`AND "createdAt" <= ${endDate}` : Prisma.empty}
        ${typeSearch ? Prisma.sql`AND type = ${typeSearch}` : Prisma.empty}
        ${typeInputSearch ? Prisma.sql`AND typeInput = ${typeInputSearch}` : Prisma.empty}
        ${codeSearch ? Prisma.sql`AND code = ${codeSearch}` : Prisma.empty}

      ORDER BY "createdAt" desc
      ${pagination?.limit ? Prisma.sql`LIMIT ${pagination.limit}` : Prisma.empty}
      ${pagination?.limit && pagination?.page ? Prisma.sql`OFFSET ${pagination.limit * (pagination.page - 1)};` : Prisma.empty}
    `;
  }

  async createManualTransaction(input: CreateManualTransactionDTO) {
    const producer = Producer.create({
      queueUrl: process.env.URL_QUEUE_INPUT_WALLET_TRANSACTION,
      region: process.env.AWS_REGION_APP,
    });

    const sourceBalanceValue = ["movement", "debit"].includes(input.type)
      ? -input.value
      : input.value;

    const body = {
      userId: input.userId,
      typeInput: "manualTransaction",
      value: Math.abs(input.value),
      [input.sourceBalance]: sourceBalanceValue,
      ...(input.type === "movement" && {
        [input.destinyBalance]: input.value,
      }),
      type: input.type,
      description: input.description,
      date: new Date(),
      valueBlocked: 0,
      valueToRelease: 0,
    };

    return await producer.send({
      id: input.userId,
      groupId: input.userId,
      deduplicationId: String(crypto.randomInt(0, 1000000)),
      body: JSON.stringify(body),
    });
  }

  async findByAdmin(adminId: string, pagination?: PaginationParams) {
    const page = pagination?.page || undefined;
    const limit = pagination?.limit || undefined;
    return await this.prismaService.transactions.findMany({
      where: {
        adminId,
      },
      skip: page ? (page - 1) * limit : undefined,
      take: limit ? limit : undefined,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        wallet: true,
        card: true,
      },
    });
  }

  async getTransactionOfNextMonth(walletId: string) {
    const currentDate = new Date();
    const startNextMonth = startOfDay(addDays(currentDate, 30));
    const endNextMonth = startOfDay(addDays(currentDate, 60));

    return await this.prismaService.transactions.findMany({
      where: {
        walletId,
        date: {
          gte: startNextMonth,
          lte: endNextMonth,
        },
      },
    });
  }
}
