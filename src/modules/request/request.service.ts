import { BadRequestException, Injectable } from "@nestjs/common";
import {
  EnumRequestStatusAntecipation,
  EnumTypeRequest,
  PrismaClient,
} from "@prisma/client";
import { addDays } from "date-fns";
import { PrismaService } from "../../prisma/prisma.service";
import { RevenueAntecipationService } from "../revenue-antecipation/application/services/revenue-antecipation.service";
import { TransactionService } from "../transaction/transaction.service";
import { ListRequestByAdminDTO } from "./dto/list-request-by-admin.dto";
import { UpdateAntecipationRequest } from "./dto/update-antecipation-request.dto";
import { WithdrawRequestDto } from "./dto/withdraw-request.dto";
import axios from "axios";
import { sub } from "date-fns";
import { WalletService } from "../wallet/wallet.service";

@Injectable()
class RequestService {
  constructor(
    private prismaService: PrismaService,
    private transactionService: TransactionService,
    private revenueAntecipationService: RevenueAntecipationService,
    private walletService: WalletService,
  ) {}
  async getAntecipationRequestsByUserId(userId: string | string[]) {
    return this.prismaService.request.findFirst({
      where: {
        userId: typeof userId === "string" ? userId : { in: userId },
        status: {
          in: ["waiting", "processing"],
        },
        typeRequest: EnumTypeRequest.antecipation,
      },
    });
  }

  async getAprovedAntecipationRequestsByUserId(userId: string | string[]) {
    return this.prismaService.request.findFirst({
      where: {
        userId: typeof userId === "string" ? userId : { in: userId },
        status: {
          in: ["aproved", "autoAproved"],
        },
        typeRequest: EnumTypeRequest.antecipation,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async setAntecipationRequestToDone(userId: string) {
    const request = await this.prismaService.request.findFirst({
      where: {
        userId,
        status: {
          in: ["aproved", "autoAproved"],
        },
      },
      select: {
        id: true,
      },
    });

    return this.prismaService.request.update({
      where: {
        id: request.id,
      },
      data: {
        status: "done",
      },
    });
  }

  async listRequests(userId: string, type: "withdraw" | "antecipation") {
    return (
      this.prismaService.request.findMany({
        where: {
          userId,
          typeRequest: type ?? undefined,
        },
        orderBy: {
          createdAt: "desc",
        },
      }) ?? []
    );
  }

  async createWithdrawRequest(userId: string, body: WithdrawRequestDto) {
    const totalAmountRequest = await this.prismaService.request.aggregate({
      where: {
        typeRequest: "withdraw",
        userId,
        status: "waiting",
      },
      _sum: {
        valorRequest: true,
      },
    });

    //Get the adminId from the seller wallet
    const sellerWallet = await this.prismaService.wallet.findFirst({
      where: {
        user: userId,
      },
      select: {
        id: true,
        adminId: true,
        balanceDisponilibity: true,
      },
    });
    //To validate sellerWallet  amount is less than the wallet balance
    if (
      sellerWallet.balanceDisponilibity -
        Math.ceil(totalAmountRequest._sum.valorRequest) <
      body.amount
    ) {
      return {
        error: "The amount is greater than the wallet balance",
      };
    }

    const request = await this.prismaService.request.create({
      data: {
        userId,
        adminId: sellerWallet.adminId,
        emailUser: body.emailUser,
        typeDescount: "",
        typeRequest: `withdraw`,
        validate: new Date(),
        valorDescount: 0,
        valorRequest: body.amount,
        tax: body.tax,
        bankAccountId: body.bankAccountId,
      },
    });

    return { ...request, walletId: sellerWallet.id };
  }

  async listWithdrawRequestByAdmin(
    adminId: string,
    page?: number,
    perPage?: number,
  ) {
    const requests = await this.prismaService.request.findMany({
      where: {
        adminId,
        typeRequest: "withdraw",
      },
      select: {
        id: true,
        status: true,
        emailUser: true,
        createdAt: true,
        updatedAt: true,
        valorDescount: true,
        valorRequest: true,
        bankAccountId: true,
        tax: true,
        userId: true,
        acquirerTax: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      ...(page && perPage && { take: perPage, skip: perPage * (page - 1) }),
    });

    const count = await this.prismaService.request.count({
      where: {
        adminId,
        typeRequest: "withdraw",
      },
    });

    const data = await Promise.all(
      requests?.map(async (r) => ({
        ...r,
        wallet: await this.prismaService.wallet.findFirst({
          where: {
            user: r.userId,
          },
        }),
      })),
    );

    return {
      data,
      totalPages: Math.ceil(count / perPage),
    };
  }

  async listAntecipationRequestByAdmin(
    adminId: string,
    page?: number,
    perPage?: number,
  ) {
    const wallet = await this.prismaService.wallet.findFirst({
      where: {
        adminId: adminId,
      },
    });

    const requests = await this.prismaService.request.findMany({
      where: {
        adminId,
        typeRequest: "antecipation",
      },
      select: {
        id: true,
        status: true,
        emailUser: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        valorDescount: true,
        valorRequest: true,
        tax: true,
        acquirerTax: true,
        errorDescription: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      ...(page && perPage && { take: perPage, skip: perPage * (page - 1) }),
    });
    const transactions =
      await this.transactionService.getTransactionStartTomorrow(wallet.id);

    const count = await this.prismaService.request.count({
      where: {
        adminId,
        typeRequest: "antecipation",
      },
    });

    const data = requests?.map((r) => ({
      ...r,
      wallet,
      transactions,
      totalOftoAntecipation: r.valorDescount,
      tax: r.tax,
    }));

    return {
      data,
      totalPages: Math.ceil(count / perPage),
    };
  }

  async listRequestByAdmin(
    adminId: string,
    tax_per_installment: ListRequestByAdminDTO,
  ) {
    const requests = await this.prismaService.request.findMany({
      where: {
        adminId,
      },
      select: {
        id: true,
        status: true,
        emailUser: true,
        userId: true,
        createdAt: true,
        errorDescription: true,
      },
    });
    const requestsWithAntecipation = await Promise.all(
      requests.map(async (request) => {
        const wallet = await this.prismaService.wallet.findFirst({
          where: {
            adminId: adminId,
          },
        });
        const transactions =
          await this.transactionService.getTransactionFromNextMonth(wallet.id);
        const totaOfRevenue = transactions.reduce(
          (acc, transaction) =>
            acc + transaction.valueBlocked + transaction.valueToRelease,
          0,
        );
        const tax =
          await this.revenueAntecipationService.getTaxBaseadOnInstallements(
            transactions,
            tax_per_installment.tax_per_installment,
          );
        return Object.assign(
          {
            antecipation: {
              total: totaOfRevenue,
              tax_percentage: tax,
            },
            wallet: {
              id: wallet.id,
            },
          },
          request,
        );
      }),
    );
    return requestsWithAntecipation;
  }

  async createAntecipationRequest(body: any) {
    /*
    Create the request for antecipation of the seller, if does not exists antecipation request
    for this seller with status waiting
    The tax and the valorRequest will be calculated  in listing the request
    */
    //To find the wallet based on the userId
    const walletOfSeller = await this.prismaService.wallet.findFirst({
      where: {
        user: body.userId,
      },
      select: {
        id: true,
        adminId: true,
      },
    });
    //To get the transactions from the next month
    const transactions =
      await this.transactionService.getTransactionStartTomorrow(
        walletOfSeller.id,
      );

    if (body.provider !== "iugu") {
      //To verify if there are transactions for the next month
      if (transactions.length === 0) {
        return {
          error: "There are no transactions for the next month",
        };
      }
    }

    const requestExists = await this.prismaService.request.findFirst({
      where: {
        OR: [
          {
            userId: body.userId,
          },
          {
            companyId: body.companyId,
          },
        ],
        typeRequest: EnumTypeRequest.antecipation,
        status: {
          in: ["waiting", "processing"],
        },
      },
    });
    if (requestExists) {
      return {
        error: "Request already exists for this user",
      };
    }

    let simulationResponse: {
      success: boolean;
      status: EnumRequestStatusAntecipation;
    };

    const balanceToAnticipate = await this.walletService.getBalanceToAntecipate(
      walletOfSeller.id,
    );

    try {
      const response = await axios.post(
        `${process.env.BASE_URL_SALE}/anticipation/request`,
        {
          sellerId: body.userId,
          valueInCents: body.requestAmount,
          provider: body.provider,
          totalToRelease: balanceToAnticipate.balancetoanticipate,
        },
        {
          headers: {
            "x-api-key": process.env.API_KEY_SALE,
          },
        },
      );

      simulationResponse = response.data;
    } catch (error) {
      console.log("Error on sale anticipation request ", error?.response?.data);
      if (error?.response?.data) {
        throw new BadRequestException(error.response.data);
      }
      throw error?.response?.data ?? error;
    }
    console.log("simulationResponse ", simulationResponse);

    if (!simulationResponse.success) {
      throw "Simulation error";
    }

    let antecipationTax = 0;
    if (body.fixedFee && body.valueFee) {
      antecipationTax = Math.round(
        body.fixedFee + body.requestAmount * (body.valueFee / 100),
      );
    } else if (body.fixedFee) {
      antecipationTax = body.fixedFee;
    } else if (body.valueFee) {
      antecipationTax = Math.round(body.requestAmount * (body.valueFee / 100));
    }

    const request = await this.prismaService.request.create({
      data: {
        emailUser: body.emailUser,
        typeDescount: "thirty",
        valorDescount: body.requestAmount - antecipationTax,
        valorRequest: body.requestAmount,
        typeRequest: EnumTypeRequest.antecipation,
        validate: addDays(new Date(), 7),
        tax: antecipationTax,
        taxFixed: body.fixedFee,
        taxVariabel: body.valueFee,
        adminId: walletOfSeller.adminId,
        userId: body.userId,
        companyId: body.companyId,
        ...(transactions?.length > 0 && {
          lastTransactionDate: transactions[transactions.length - 1].createdAt,
        }),
        status: simulationResponse.status,
        automaticPayment: body.automaticPayment,
        ...(body.reservePercentage && {
          reservePercentage: Number(body.reservePercentage),
        }),
      },
    });
    return {
      data: { ...request, walletId: walletOfSeller.id },
    };
  }

  async updateAntecipationRequest(
    id: string,
    body: UpdateAntecipationRequest,
    trx?: any,
  ) {
    //To verify if the withdraw request exists

    const requestExists = await this.prismaService.request.findFirst({
      where: {
        id,
      },
    });
    if (!requestExists) {
      return null;
    }
    const client: PrismaClient = trx ?? this.prismaService;
    const request = await client.request.update({
      where: {
        id,
      },
      data: {
        ...body,
      },
    });
    return request;
  }

  async getApprovedWithDrawRequestByAdmin(adminId: string, requestId: string) {
    //To get the withdraw approved request by adminId
    return this.prismaService.request.findFirst({
      where: {
        id: requestId,
        adminId,
        status: {
          in: ["aproved", "autoAproved"],
        },
        typeRequest: EnumTypeRequest.withdraw,
      },
    });
  }

  async getProcessingAnticipationsToVerifyStatus() {
    return this.prismaService.request.findMany({
      where: {
        status: "processing",
        createdAt: {
          lte: sub(new Date(), { minutes: 10 }),
        },
      },
    });
  }

  async getWithdrawByExternalId(externalId: string) {
    return this.prismaService.request.findFirst({
      where: {
        externalId,
        typeRequest: "withdraw",
      },
    });
  }

  async setExternalIdOnRequest(id: string, externalId: string) {
    return this.prismaService.request.update({
      where: {
        id,
      },
      data: {
        externalId,
      },
    });
  }
}
export { RequestService };
