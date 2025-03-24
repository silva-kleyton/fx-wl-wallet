import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { PaginationParams } from "../../utils/paginations/dto/paginationParams";
import { paginateResponse } from "../../utils/paginations/pagination-response";
import { CreateWalletDto } from "./dto/create-wallet.dto";
import { UpdateWalletDto } from "./dto/update-wallet.dto";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class WalletService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createWalletDto: CreateWalletDto) {
    const { userId, isAdmin, adminId } = createWalletDto;

    const wallet = await this.prismaService.wallet.findUnique({
      where: {
        user: userId,
      },
    });

    if (wallet) throw new BadRequestException("wallet user exists");

    return await this.prismaService.wallet.create({
      data: {
        user: userId,
        isAdmin,
        adminId,
      },
    });
  }

  async findAll(userId: string, pagination?: PaginationParams) {
    if (pagination) {
      const { limit, page } = pagination;
      const data = await this.prismaService.$transaction([
        this.prismaService.wallet.count({
          where: {
            user: userId,
          },
        }),
        this.prismaService.wallet.findMany({
          where: {
            user: userId,
          },
          skip: (page - 1) * limit,
          take: limit,
          orderBy: {
            createdAt: "desc",
          },
        }),
      ]);

      return paginateResponse(data, page, limit);
    }

    return this.prismaService.wallet.findMany({
      where: {
        user: userId,
      },
      include: {
        transactions: {
          include: {
            balanceHistory: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const wallet = await this.prismaService.wallet.findFirst({
      where: {
        id,
      },
      include: {
        transactions: true,
        userInfo: true,
      },
    });

    if (!wallet) throw new NotFoundException("wallet not found");

    return wallet;
  }

  async findWalletUser(id: string, justWallet = true) {
    const wallet = await this.prismaService.wallet.findUnique({
      where: {
        user: id,
      },
      include: {
        transactions: {
          take: 10,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    if (!wallet) throw new NotFoundException("wallet not found");

    if (justWallet) {
      return {
        ...wallet,
      };
    }

    const totalAmountRequest = await this.prismaService.request.aggregate({
      where: {
        typeRequest: "withdraw",
        userId: id,
        status: "waiting",
      },
      _sum: {
        valorRequest: true,
      },
    });

    const balanceToAnticipate = await this.getBalanceToAntecipate(wallet.id);
    console.log(balanceToAnticipate);

    return {
      ...wallet,
      totalAmountRequest: Math.ceil(totalAmountRequest?._sum?.valorRequest),
      balanceToAnticipate: balanceToAnticipate?.balancetoanticipate,
    };
  }

  async getBalanceToAntecipate(walletId: string) {
    console.log("walletId ", walletId);
    const result = await this.prismaService.$queryRaw`
      SELECT
        SUM("valueToRelease") as balanceToRelease, 
        SUM(valueReleased) as balanceReleased,
        SUM(COALESCE("valueToRelease",0) + COALESCE(valueReleased,0)) as balanceToAnticipate
      FROM (
        SELECT
          tb1."valueToRelease",
          (SELECT
            SUM("valueToRelease")
          FROM
            "public"."Transactions" as tb2
          WHERE
            "walletId" = tb1."walletId"
            AND "saleId" = tb1."saleId"
            AND "valueToRelease" < 0
          ) as valueReleased
        FROM
          "public"."Transactions" as tb1
        WHERE
          "walletId" = ${walletId}
          AND "valueToRelease" > 0
          AND "dateUnlockAnticipation" <= CURRENT_DATE
      ) as tb3  
    `;

    return result[0];
  }

  async getComissionsSale(saleId: string) {
    return await this.prismaService.transactions.findMany({
      where: {
        saleId,
      },
    });
  }

  async update(id: string, data: UpdateWalletDto, trx?: any) {
    const client: PrismaClient = trx ?? this.prismaService;
    return await client.wallet.update({
      where: {
        id,
      },
      data,
    });
  }

  async remove(id: string) {
    const wallet = await this.prismaService.wallet.findFirst({
      where: {
        id: id,
      },
    });

    if (!wallet) throw new BadRequestException("wallet not found");

    return await this.prismaService.wallet.delete({
      where: {
        id,
      },
    });
  }
}
