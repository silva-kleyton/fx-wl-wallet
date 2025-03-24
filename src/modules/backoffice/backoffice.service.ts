import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  EnumTypeInput,
  EnumTypeRequest,
  EnumTypeTransaction,
  Prisma,
} from "@prisma/client";
import { addDays, endOfDay, startOfDay, subDays, subHours } from "date-fns";
import { PrismaService } from "../../prisma/prisma.service";
import { CoreService } from "../../services/core/core.service";
import { percentageComissionValue } from "../../utils/calculates";
import { calcPercentage } from "../../utils/convert/calc-percentage";
import { generateCodeTansaction } from "../../utils/generate-codes";
import { maskMoneyInt } from "../../utils/mask/add-mask-money";
import { EMessageType } from "../../utils/notification/dto/send-notification.dto";
import { EnumTemplates } from "../../utils/notification/dto/templates";
import sendNotification from "../../utils/notification/send-notification";
import { ConfirmedAntecipationDto } from "./dto/confirmed-antecipation.dto";
import { ConfirmedWithdrawDto } from "./dto/confirmed-withdraw.dto";
import {
  CreateBackofficeDto,
  NotificationDto,
  SelectDays,
} from "./dto/create-backoffice.dto";
import { RequestAntecipationDto } from "./dto/request-antecipation.dto";

interface ISaleSearch {
  valueAntecipation: number;
  ids: string[];
}

@Injectable()
export class BackofficeService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly coreService: CoreService,
  ) {}

  async saleSearch(
    startDay: Date,
    endDay: Date,
    userID: string,
  ): Promise<ISaleSearch> {
    // startDay (1/14)
    // endDay (15/30)
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
              typeInput: EnumTypeInput.sellerCommission,
            },
          ],
        },
      },
    });

    const valueAntecipation = Data.reduce((acc, value) => {
      acc += value.value;
      return acc;
    }, 0);

    const ids = Data.map(({ id }) => id);

    return {
      valueAntecipation,
      ids,
    };
  }

  async create(
    createBackofficeDto: CreateBackofficeDto,
    notification: NotificationDto,
  ) {
    // const emailTo = () => {
    //   return process.env.NODE_ENV === "prod"
    //     ? "eli@khure.com.br"
    //     : "kleiton@khure.com.br";
    // };

    const currentDate = new Date();

    // const [year, month, day] = currentDate
    //   .toISOString()
    //   .split("T")[0]
    //   .split("-");
    switch (notification) {
      case NotificationDto.Withdraw: {
        const taxWithdraw = Number(process.env.TAX_WITHDRAW);
        const wallet = await this.prismaService.wallet.findFirst({
          where: {
            user: createBackofficeDto.userId,
          },
        });

        if (!wallet) {
          throw new NotFoundException({
            message: "user not wallet",
          });
        }

        if (!createBackofficeDto.valueRequest) {
          throw new BadRequestException({
            message: "value request is requered",
          });
        }

        if (
          wallet.balanceDisponilibity <= 0 ||
          wallet.balanceDisponilibity < createBackofficeDto?.valueRequest
        ) {
          throw new NotFoundException({
            message: "user with insufficient balance",
          });
        }

        if (!createBackofficeDto?.account && !createBackofficeDto.pix) {
          throw new BadRequestException({
            message: "pix and account not sent",
          });
        }

        return await this.prismaService.request.create({
          data: {
            emailUser: createBackofficeDto.email,
            typeDescount:
              createBackofficeDto.selectDays || SelectDays.totalDays,
            valorDescount: 0,
            valorRequest: createBackofficeDto.valueRequest,
            typeRequest: EnumTypeRequest.withdraw,
            validate: new Date(),
            tax: taxWithdraw,
            adminId: createBackofficeDto.adminId,
          },
        });
      }
      case NotificationDto.Anticipation: {
        if (!createBackofficeDto.selectDays) {
          throw new BadRequestException({
            message: "select days is required",
          });
        }
        let descountValueAntecipation;
        const transactionsIds: string[] = [];

        const { fourteenDescount, thirtyDescount } =
          await this.coreService.requestAdvance(createBackofficeDto.userId);

        const beforeYesterday = subDays(currentDate, 2);
        const daySelectFourteen = addDays(beforeYesterday, 14);
        const dayFifteen = addDays(daySelectFourteen, 1);
        const daySelectThirty = addDays(beforeYesterday, 30);
        const validate = addDays(new Date(), 2);

        switch (createBackofficeDto.selectDays) {
          case SelectDays.fourteen:
            const saleFourTeenSelect = await this.saleSearch(
              daySelectFourteen,
              beforeYesterday,
              createBackofficeDto.userId,
            );
            if (!saleFourTeenSelect.valueAntecipation) {
              throw new NotFoundException({
                message: "user not antecipation",
              });
            }
            transactionsIds.push(...saleFourTeenSelect.ids);

            const descontFourteenReleaseSelect = calcPercentage(
              saleFourTeenSelect.valueAntecipation,
              fourteenDescount,
            );
            descountValueAntecipation =
              saleFourTeenSelect.valueAntecipation -
              descontFourteenReleaseSelect;
            break;
          case SelectDays.thirty:
            const saleThirtySelect = await this.saleSearch(
              daySelectFourteen,
              beforeYesterday,
              createBackofficeDto.userId,
            );
            if (!saleThirtySelect.valueAntecipation) {
              throw new NotFoundException({
                message: "user not antecipation",
              });
            }
            transactionsIds.push(...saleThirtySelect.ids);

            const descontThirtyReleaseSelect = calcPercentage(
              saleThirtySelect.valueAntecipation,
              fourteenDescount,
            );
            descountValueAntecipation =
              saleThirtySelect.valueAntecipation - descontThirtyReleaseSelect;
            break;
          case SelectDays.totalDays:
            const saleFourteenSelectTotal = await this.saleSearch(
              daySelectFourteen,
              beforeYesterday,
              createBackofficeDto.userId,
            );
            const saleThirtySelectTotal = await this.saleSearch(
              daySelectThirty,
              dayFifteen,
              createBackofficeDto.userId,
            );

            if (
              !saleFourteenSelectTotal.valueAntecipation &&
              !saleThirtySelectTotal.valueAntecipation
            ) {
              throw new NotFoundException({
                message: "user not antecipation",
              });
            }

            transactionsIds.push(...saleFourteenSelectTotal.ids);

            const descontFourteenRelease = calcPercentage(
              saleFourteenSelectTotal.valueAntecipation,
              fourteenDescount,
            );

            const finalValueFourteen =
              saleFourteenSelectTotal.valueAntecipation -
              descontFourteenRelease;

            transactionsIds.push(...saleThirtySelectTotal.ids);

            const descontThirtyRelease = calcPercentage(
              saleThirtySelectTotal.valueAntecipation,
              thirtyDescount,
            );
            const finalValueThirty =
              saleThirtySelectTotal.valueAntecipation - descontThirtyRelease;

            descountValueAntecipation = finalValueFourteen + finalValueThirty;
            break;
          default:
            throw new BadRequestException({
              mensage: "type select days is invalid",
            });
        }

        const requeridTransaction = await this.prismaService.request.create({
          data: {
            emailUser: createBackofficeDto.email,
            typeDescount: createBackofficeDto.selectDays,
            valorDescount: descountValueAntecipation,
            valorRequest: descountValueAntecipation,
            typeRequest: EnumTypeRequest.antecipation,
            validate,
            transactions: {
              connect: transactionsIds.map((value) => ({ id: value })),
            },
          },
        });

        // const variables = {
        //   email: createBackofficeDto.email,
        //   name: createBackofficeDto.name,
        //   document: createBackofficeDto.document,
        //   phone: createBackofficeDto.phone,
        //   requeridTransactionId: requeridTransaction.id,
        //   date: `${day}/${month}/${year}`,
        //   valueRequest: descountValueAntecipation,
        //   valueTotal: descountValueAntecipation,
        //   typeDescont: createBackofficeDto.selectDays,
        //   balanceAvailable: createBackofficeDto.balanceAvailable,
        //   balanceToRelease: createBackofficeDto.balanceToRelease,
        // };

        // await sendNotification({
        //   type: EMessageType.Email,
        //   data: {
        //     to: emailTo(),
        //     from: "360 Hub <sac@khure.com.br>",
        //   },
        //   template: {
        //     type: EnumTemplates.RequireAntecipation,
        //     variables,
        //   },
        // });

        return { response: "send email" };
      }
      default:
        throw new BadRequestException();
    }
  }

  async previewAntecipationValue(email: string, days: number) {
    const response = await this.simulatedAntecipationRequest(email, days);

    return { ...response, transactions: undefined };
  }

  // requisição de antecipação
  async requestAntecipation(requestAntecipationDto: RequestAntecipationDto) {
    const {
      email,
      selectDays,
      valueRequest,
      name,
      document,
      phone,
      pix,
      typePix,
      account,
    } = requestAntecipationDto;

    const emailTo = () => {
      return process.env.NODE_ENV === "prod"
        ? "eli@khure.com.br"
        : "kleiton@khure.com.br";
    };

    const dataAntecipation = await this.simulatedAntecipationRequest(
      email,
      selectDays,
    );

    const wallet = await this.prismaService.wallet.findFirst({
      where: {
        user: dataAntecipation.user.id,
      },
    });

    if (!wallet) throw new BadRequestException("Wallet user not found");

    if (wallet.balanceToRelease < valueRequest) {
      throw new BadRequestException({
        message: "user with insufficient balance to release",
      });
    }

    if (dataAntecipation.totalDisponibilityAntecipation <= 0) {
      throw new BadRequestException(
        "The user has no possibility of antecipation, the antecipation value must be more then 0",
      );
    }

    if (dataAntecipation.totalDisponibilityAntecipation !== valueRequest) {
      throw new BadRequestException(
        "value request not equal to disponibility antecipation",
      );
    }

    const currentDate = new Date();

    const [year, month, day] = currentDate
      .toISOString()
      .split("T")[0]
      .split("-");

    const request = await this.prismaService.request.create({
      data: {
        emailUser: email,
        typeDescount: selectDays === 15 ? "fourteen" : "thirty",
        valorDescount: 0,
        valorRequest: valueRequest,
        typeRequest: EnumTypeRequest.antecipation,
        validate: new Date(),
        tax: dataAntecipation.valueService360,
        transactions: {
          connect: dataAntecipation.transactions.map((id) => id),
        },
      },
    });

    const variables = {
      email: email,
      name: name,
      document: document,
      phone: phone,
      date: `${day}/${month}/${year}`,
      userId: dataAntecipation.user.id,
      valueRequest: maskMoneyInt(
        (dataAntecipation.totalDisponibilityAntecipation -
          dataAntecipation.valueService360) /
          100,
      ),
      taxPercentage360: dataAntecipation.percentageService,
      taxValue360: maskMoneyInt(dataAntecipation.valueService360 / 100),
      requeridTransactionId: request.id,
      valueTotal: maskMoneyInt(
        dataAntecipation.totalDisponibilityAntecipation / 100,
      ),
      typeDescount: selectDays,
      balanceAvailable: maskMoneyInt(wallet.balanceDisponilibity / 100),
      balanceToRelease: maskMoneyInt(wallet.balanceToRelease / 100),
      pix: pix ? pix : "",
      typePix: typePix && typePix ? typePix : "",
      nameBank: account && account.nameBank ? account.nameBank : "",
      agency: account && account?.agency ? account.agency : "",
      account: account && account?.account ? account.account : "",
    };

    await sendNotification({
      type: EMessageType.Email,
      data: {
        to: emailTo(),
        from: "360 Hub <sac@khure.com.br>",
      },
      template: {
        type: EnumTemplates.RequireAntecipation,
        variables,
      },
    });

    return { response: "send email" };
  }

  async refusedAntecipation(id: string) {
    const data = await this.prismaService.request.findFirst({
      where: {
        id,
      },
    });

    if (!data) {
      throw new NotFoundException({
        message: "resquest antecipation not found",
      });
    }

    return this.prismaService.request.update({
      where: {
        id,
      },
      data: {
        status: "denied",
        closed: true,
      },
    });
  }

  async getSolicitation(email: string) {
    const data = await this.prismaService.request.findMany({
      where: {
        emailUser: email,
        closed: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return data;
  }

  // async confirmedAnticipation(sendQueueBackOfficeDto: SendQueueBackofficeDto) {
  //   const requestAntecipation = await this.prismaService.request.findFirst({
  //     where: {
  //       id: sendQueueBackOfficeDto.requestId,
  //     },
  //     include: {
  //       transactions: {
  //         include: {
  //           wallet: true,
  //         },
  //       },
  //     },
  //   });

  //   if (!requestAntecipation) {
  //     throw new NotFoundException({
  //       message: "request antecipation not found",
  //     });
  //   }

  //   const { transactions } = requestAntecipation;

  //   if (!transactions.length) {
  //     throw new NotFoundException({
  //       message:
  //         "request antecipation, not transaction (transaction not found)",
  //     });
  //   }
  //   if (!sendQueueBackOfficeDto.authorized) {
  //     await this.prismaService.request.update({
  //       where: {
  //         id: sendQueueBackOfficeDto.requestId,
  //       },
  //       data: {
  //         transactions: {
  //           disconnect: requestAntecipation.transactions.map(({ id }) => ({
  //             id: id,
  //           })),
  //         },
  //       },
  //     });
  //   } else {
  //     // update case approved request antecipation
  //     await this.prismaService.transactions.updateMany({
  //       where: {
  //         code: {
  //           in: requestAntecipation.transactions.map(({ code }) => code),
  //         },
  //       },
  //       data: {
  //         anteciped: true,
  //       },
  //     });
  //   }
  //   const userId = transactions.reduce((_, value) => {
  //     return value.wallet.user;
  //   }, "");

  //   const valueToRelease = transactions.reduce((acc, value) => {
  //     acc += value.valueToRelease;
  //     return acc;
  //   }, 0);

  //   const valueDisponilibity = transactions.reduce((acc, value) => {
  //     acc += value.valueDisponilibity;
  //     return acc;
  //   }, 0);

  //   await sendQueueTransactionFIFO({
  //     typeInput: EnumTypeInput.antecipation,
  //     value: valueToRelease,
  //     type: EnumTypeTransaction.movement,
  //     userId: userId,
  //     description: sendQueueBackOfficeDto.description,
  //     requestStatusAntecipation: sendQueueBackOfficeDto.authorized
  //       ? EnumRequestStatusAntecipation.aproved
  //       : EnumRequestStatusAntecipation.denied,
  //     emailAuditor: sendQueueBackOfficeDto.emailAuditor,
  //     referenceRequireId: requestAntecipation.id,
  //     date: new Date(),
  //     valueToRelease: -valueToRelease,
  //     valueDisponilibity: valueDisponilibity + valueToRelease,
  //     valueBlocked: 0,
  //     priceSale: requestAntecipation.valorRequest,
  //   });
  // }

  async confirmedAnticipation(
    confirmedAntecipationDto: ConfirmedAntecipationDto,
  ) {
    const request = await this.prismaService.request.findFirst({
      where: {
        id: confirmedAntecipationDto.requestId,
        typeRequest: "antecipation",
      },
      include: {
        transactions: true,
      },
    });

    if (!request) {
      throw new NotFoundException({
        message: "request antecipation not found",
      });
    }

    if (request.status !== "waiting")
      throw new BadRequestException("Request not permited antecipation");

    if (!confirmedAntecipationDto.userId) {
      throw new NotFoundException({
        message: "user id not found",
      });
    }

    const wallet = await this.prismaService.wallet.findFirst({
      where: {
        user: confirmedAntecipationDto.userId,
      },
    });

    if (!wallet) {
      throw new NotFoundException({
        message: "user cannot wallet",
      });
    }

    if (wallet.balanceToRelease < request.valorRequest) {
      throw new BadRequestException({
        message: "user with insufficient balance to release",
      });
    }

    const antecipationValue = request.valorRequest - request.tax;

    await this.prismaService.$transaction([
      this.prismaService.wallet.update({
        where: { id: wallet.id },
        data: {
          balanceToRelease: (wallet.balanceToRelease -= request.valorRequest),
          balanceDisponilibity: (wallet.balanceDisponilibity +=
            antecipationValue),
          transactions: {
            create: {
              code: generateCodeTansaction(),
              type: EnumTypeTransaction.movement,
              typeInput: EnumTypeInput.antecipation,
              value: 0,
              valueToRelease: -request.valorRequest,
              valueDisponilibity: antecipationValue,
              date: new Date(),
              tax: request.tax,
              balanceHistory: {
                create: {
                  balanceBlocked: wallet.balanceBlocked,
                  balanceToRelease: wallet.balanceToRelease,
                  balanceDisponilibity: wallet.balanceDisponilibity,
                },
              },
            },
          },
        },
      }),
      this.prismaService.request.update({
        where: {
          id: request.id,
        },
        data: {
          status: "aproved",
          closed: true,
          transactions: {
            updateMany: {
              where: {
                id: {
                  in: request.transactions.map((transaction) => transaction.id),
                },
              },
              data: {
                anteciped: true,
              },
            },
          },
        },
      }),
    ]);

    return { message: "Antecipation success" };
  }

  async confirmedWidthraw(confirmedWidthraw: ConfirmedWithdrawDto) {
    const request = await this.prismaService.request.findFirst({
      where: {
        id: confirmedWidthraw.requestId,
      },
    });

    if (!request) {
      throw new NotFoundException({
        message: "request withdraw not found",
      });
    }

    if (request.status !== "waiting")
      throw new BadRequestException("Request not permited withdraw");

    if (!confirmedWidthraw.userId) {
      throw new NotFoundException({
        message: "user id not found",
      });
    }

    const wallet = await this.prismaService.wallet.findFirst({
      where: {
        user: confirmedWidthraw.userId,
      },
    });

    if (!wallet) {
      throw new NotFoundException({
        message: "user cannot wallet",
      });
    }

    if (wallet.balanceDisponilibity < request.valorRequest) {
      throw new BadRequestException({
        message: "user with insufficient balance",
      });
    }

    const taxWithdraw = Number(process.env.TAX_WITHDRAW);
    const withdrawalValue = request.valorRequest - taxWithdraw;

    await this.prismaService.$transaction([
      this.prismaService.wallet.update({
        where: {
          id: wallet.id,
        },
        data: {
          balance: (wallet.balance += withdrawalValue),
          balanceDisponilibity: (wallet.balanceDisponilibity -=
            withdrawalValue),
          transactions: {
            create: {
              code: generateCodeTansaction(),
              type: EnumTypeTransaction.debit,
              typeInput: EnumTypeInput.withdrawal,
              value: -withdrawalValue,
              valueDisponilibity: -withdrawalValue,
              date: new Date(),
              tax: request.tax,
              balanceHistory: {
                create: {
                  balanceBlocked: wallet.balanceBlocked,
                  balanceToRelease: wallet.balanceToRelease,
                  balanceDisponilibity: wallet.balanceDisponilibity,
                },
              },
            },
          },
        },
      }),
      this.prismaService.request.update({
        where: {
          id: request.id,
        },
        data: {
          status: "aproved",
          closed: true,
        },
      }),
    ]);

    return { message: "Withdraw authorized" };

    // return this.prismaService.wallet.update({
    //   where: {
    //     id: wallet.id,
    //   },
    //   data: {
    //     balance: (wallet.balance += request.valorRequest),
    //     balanceDisponilibity: (wallet.balanceDisponilibity -=
    //       request.valorRequest),
    //     transactions: {
    //       create: {
    //         code: generateCodeTansaction(),
    //         type: EnumTypeTransaction.debit,
    //         typeInput: EnumTypeInput.withdrawal,
    //         value: -request.valorRequest,
    //         valueDisponilibity: -request.valorRequest,
    //         date: new Date(),
    //         balanceHistory: {
    //           create: {
    //             balanceBlocked: wallet.balanceBlocked,
    //             balanceToRelease: wallet.balanceToRelease,
    //             balanceDisponilibity: wallet.balanceDisponilibity,
    //           },
    //         },
    //       },
    //     },
    //   },
    // });

    // await sendQueueTransactionFIFO({
    //   typeInput: EnumTypeInput.withdrawal,
    //   value: request.valorRequest,
    //   type: EnumTypeTransaction.debit,
    //   userId: confirmedWidthraw.userId,
    //   description: confirmedWidthraw.description,
    //   requestStatusAntecipation: confirmedWidthraw.authorized
    //     ? EnumRequestStatusAntecipation.aproved
    //     : EnumRequestStatusAntecipation.denied,
    //   emailAuditor: confirmedWidthraw.emailAuditor,
    //   referenceRequireId: request.id,
    //   date: new Date(),
    //   valueToRelease: -0,
    //   valueDisponilibity: wallet.balanceDisponilibity - request.valorRequest,
    //   valueBlocked: 0,
    //   priceSale: request.valorRequest,
    // });
  }

  /** Busca das requisições de criação de cartão, que deram erro */
  async getRequestCreatedCardError() {
    return this.prismaService.userInfo.findMany({
      where: {
        providerError: true,
        checkedBackOffice: null,
      },
    });
  }

  /** checar a requisição de erro, de criação de cartão */
  async checkRequestCreatedCard(id: string) {
    const userInfo = await this.prismaService.userInfo.findFirst({
      where: {
        id,
      },
    });

    if (userInfo)
      throw new NotFoundException("info user request card not found");

    return this.prismaService.userInfo.update({
      where: { id },
      data: {
        checkedBackOffice: new Date(),
      },
    });
  }

  async simulatedAntecipationRequest(email: string, days: number) {
    let startDate, endDate, tax;

    switch (days) {
      case 15:
        startDate = addDays(subHours(startOfDay(new Date()), 3), 3);
        endDate = addDays(subHours(endOfDay(new Date()), 3), 15);
        tax = 2.25;
        break;

      case 30:
        startDate = addDays(subHours(startOfDay(new Date()), 3), 16);
        endDate = addDays(subHours(endOfDay(new Date()), 3), 30);
        tax = 3.49;
        break;

      default:
        throw new BadRequestException("Days antecipation 15 or 30");
    }

    const user = await this.coreService.getUserByEmail(email);

    const query: Prisma.TransactionsWhereInput = {
      anteciped: false,
      availableValue: false,
      wallet: {
        user: user.id,
      },
      dateUnlock: {
        gte: startDate,
        lte: endDate,
      },
    };

    const {
      _sum: { valueToRelease },
    } = await this.prismaService.transactions.aggregate({
      where: query,
      _sum: {
        valueToRelease: true,
      },
    });

    const transactions = await this.prismaService.transactions.findMany({
      where: query,
      select: {
        id: true,
      },
    });

    const valueService360 = percentageComissionValue(valueToRelease, tax);

    return {
      percentageService: tax,
      totalDisponibilityAntecipation: valueToRelease ?? 0,
      valueService360,
      valueAntecipationClient: valueToRelease - valueService360,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      transactions,
    };
  }
}
