import { Injectable } from "@nestjs/common";
import {
  EnumRequestStatusAntecipation,
  EnumTypeInput,
  EnumTypeTransaction,
  Prisma,
} from "@prisma/client";
import { plainToInstance } from "class-transformer";
import { ValidationError, Validator } from "class-validator";
import { addDays } from "date-fns";
import { PrismaService } from "../../prisma/prisma.service";
import { generateCodeTansaction } from "../../utils/generate-codes";
import { ChargebackDto } from "./dto/chargeback.dto";
import { ETypeSaleTransaction } from "./dto/create-balance.dto";
import { DischargeCardDto } from "./dto/discharge-card.dto";
import { InputTransactionWalletDto } from "./dto/input-transaction-wallet.dto";
import { RechargeCardDto } from "./dto/recharge-card.dto";
import { RechargeDto } from "./dto/recharge-wallet.dto";
import { SaleRefundDto } from "./dto/sale-refund.dto";
import { UpdateBalanceDto } from "./dto/update-balance.dto";
import { PreChargebackAlertDto } from "./dto/pre-chargeback-alert.dto";

@Injectable()
export class BalanceService {
  constructor(private readonly prismaService: PrismaService) {}

  // async addWalletBalanceForSaleAndCommission(
  //   createBalanceDto: CreateBalanceDto
  // ) {
  //   if (!createBalanceDto.userId) {
  //     throw new BadRequestError("userId is required");
  //   }

  //   const errors = await (
  //     await validate(createBalanceDto)
  //   ).map((item) => Object.values(item.constraints));

  //   if (errors.length > 0) throw new BadRequestException(errors);

  //   let wallet = await this.prismaService.wallet.findUnique({
  //     where: {
  //       user: createBalanceDto.userId,
  //     },
  //   });

  //   // caso o usuário não possua uma carteira criar a wallet.
  //   if (!wallet) {
  //     wallet = await this.prismaService.wallet.create({
  //       data: {
  //         user: createBalanceDto.userId,
  //       },
  //     });
  //   }

  //   const transactionExists = await this.prismaService.transactions.findFirst({
  //     where: {
  //       type: "deposit",
  //       typeInput: createBalanceDto.typeInput,
  //       saleId: createBalanceDto.saleId,
  //       // typeSaleTransaction: createBalanceDto.typeSale,
  //       value: createBalanceDto.value,
  //     },
  //   });

  //   if (transactionExists) {
  //     console.log("Transação já existe:", JSON.stringify(transactionExists));
  //     return;
  //   }

  //   // comissão da 360
  //   if (createBalanceDto.typeInput === "comissionCheckout") {
  //     console.log("Comissão da 360");
  //     return await this.prismaService.wallet.update({
  //       where: {
  //         id: wallet.id,
  //       },
  //       data: {
  //         balance: (wallet.balance += createBalanceDto.value),
  //         transactions: {
  //           create: {
  //             saleId: createBalanceDto.saleId,
  //             type: "deposit",
  //             typeInput: "comissionCheckout",
  //             priceSale: createBalanceDto.priceSale,
  //             value: createBalanceDto.value,
  //             date: new Date(),
  //             dateUnlock: new Date(),
  //             // typeSaleTransaction: createBalanceDto.typeSale,
  //             comission: createBalanceDto?.percentageComission || 0,
  //             referenceComissionSale: createBalanceDto.referenceComissionSale,
  //           },
  //         },
  //       },
  //     });
  //   }

  //   /** Comissão do afiliado  */
  //   if (createBalanceDto.typeInput === "comission") {
  //     console.log("Comissão do afiliado");

  //     return await this.prismaService.wallet.update({
  //       where: {
  //         id: wallet.id,
  //       },
  //       data: {
  //         balance: (wallet.balance += createBalanceDto.value),
  //         transactions: {
  //           create: {
  //             saleId: createBalanceDto.saleId,
  //             type: "deposit",
  //             typeInput: "comission",
  //             priceSale: createBalanceDto.priceSale,
  //             value: createBalanceDto.value,
  //             date: new Date(),
  //             dateUnlock: addDays(new Date(), 30),
  //             // typeSaleTransaction: createBalanceDto.typeSale,
  //             comission: createBalanceDto?.percentageComission || 0,
  //             referenceComissionSale: createBalanceDto.referenceComissionSale,
  //           },
  //         },
  //       },
  //     });
  //   }

  //   /** Comissão do vendedor */
  //   if (createBalanceDto.typeInput === "sale") {
  //     console.log("Comissão do vendedor");

  //     return await this.prismaService.wallet.update({
  //       where: {
  //         id: wallet.id,
  //       },
  //       data: {
  //         balance: (wallet.balance += createBalanceDto.value),
  //         transactions: {
  //           create: {
  //             saleId: createBalanceDto.saleId,
  //             type: "deposit",
  //             typeInput: createBalanceDto.typeInput,
  //             priceSale: createBalanceDto.priceSale,
  //             value: createBalanceDto.value,
  //             date: new Date(),
  //             dateUnlock: addDays(new Date(), 30),
  //             // typeSaleTransaction: createBalanceDto.typeSale,
  //             comission: createBalanceDto?.percentageComission || 0,
  //             referenceComissionSale: createBalanceDto.referenceComissionSale,
  //           },
  //         },
  //       },
  //     });
  //   }

  //   throw new BadRequestError("type cash invalid");
  // }

  async isValidInputTransaction(
    input: InputTransactionWalletDto,
  ): Promise<ValidationError[]> {
    const validator = new Validator();
    return await validator.validate(input, {});
  }
  async isValidInputPreChargebackAlert(
    input: PreChargebackAlertDto,
  ): Promise<ValidationError[]> {
    const validator = new Validator();
    return await validator.validate(input, {});
  }

  async inputTransactionWallet(createBalanceDto: InputTransactionWalletDto) {
    createBalanceDto.valueToRelease = !!createBalanceDto.valueToRelease
      ? Math.round(createBalanceDto.valueToRelease)
      : 0;
    createBalanceDto.valueDisponibility = !!createBalanceDto.valueDisponibility
      ? Math.round(createBalanceDto.valueDisponibility)
      : 0;
    createBalanceDto.valueReserved = !!createBalanceDto.valueReserved
      ? Math.round(createBalanceDto.valueReserved)
      : 0;
    createBalanceDto.valueBlocked = !!createBalanceDto.valueBlocked
      ? Math.round(createBalanceDto.valueBlocked)
      : 0;

    const isValid = await this.isValidInputTransaction(createBalanceDto);
    if (isValid.length !== 0) {
      isValid.map((item) => console.error(item.constraints));
      throw "error input transaction";
    }

    let wallet = await this.prismaService.wallet.findUnique({
      where: {
        user: createBalanceDto.userId || createBalanceDto.sellerAdminId,
      },
    });

    // caso o usuário não possua uma carteira criar a wallet.
    if (!wallet) {
      if (createBalanceDto.userId) {
        wallet = await this.prismaService.wallet.create({
          data: {
            user: createBalanceDto.userId,
            ...(createBalanceDto.sellerAdminId && {
              adminId: createBalanceDto.sellerAdminId,
            }),
          },
        });
      }
      if (createBalanceDto.sellerAdminId) {
        wallet = await this.prismaService.wallet.create({
          data: {
            user: createBalanceDto.sellerAdminId,
            isAdmin: true,
          },
        });
        if (!createBalanceDto.sellerAdminId.startsWith("acquirer")) {
          await this.prismaService.wallet.create({
            data: {
              user: `acquirer-${createBalanceDto.sellerAdminId}`,
              isAdmin: true,
            },
          });
        }
      }
    }

    const code = generateCodeTansaction();

    const validator = new Validator();

    switch (createBalanceDto.typeInput) {
      // juros e taxas da venda para 360
      case EnumTypeInput.feesAndInterest:
        // se a tansação for do mesmo tipo de entrada com o mesmo id de venda. Significa que a transação já existe
        const transactionFeesAndInterest =
          await this.prismaService.transactions.findFirst({
            where: {
              type: "deposit",
              typeInput: createBalanceDto.typeInput,
              saleId: createBalanceDto.saleId,
              value: createBalanceDto.value,
            },
          });

        if (transactionFeesAndInterest) {
          console.log(
            "Transação já existe:",
            JSON.stringify(transactionFeesAndInterest),
          );
          return;
        }

        return await this.prismaService.wallet.update({
          where: {
            id: wallet.id,
          },
          data: {
            balanceBlocked: (wallet.balanceBlocked +=
              createBalanceDto.valueBlocked),
            balanceToRelease: (wallet.balanceToRelease +=
              createBalanceDto.valueToRelease),
            balanceDisponilibity: (wallet.balanceDisponilibity +=
              createBalanceDto.valueDisponibility),
            transactions: {
              create: {
                saleId: createBalanceDto.saleId,
                description: createBalanceDto.description,
                code,
                type: createBalanceDto.type ?? "deposit",
                typeInput: "feesAndInterest",
                priceSale: createBalanceDto.priceSale,
                value: createBalanceDto.value,
                valueBlocked: createBalanceDto.valueBlocked,
                valueToRelease: createBalanceDto.valueToRelease,
                valueDisponilibity: createBalanceDto.valueDisponibility,
                date: new Date(),
                //dateUnlock: new Date(),
                // comission: createBalanceDto?.percentageComission || 0,
                referenceComissionSale: createBalanceDto.referenceComissionSale,
                balanceHistory: {
                  create: {
                    balanceBlocked: wallet.balanceBlocked,
                    balanceToRelease: wallet.balanceToRelease,
                    balanceDisponilibity: wallet.balanceDisponilibity,
                  },
                },
                adminId: createBalanceDto.sellerAdminId || null,
              },
            },
          },
        });

      // comissão 360 do vendedor
      case EnumTypeInput.sallerCommission360:
        // se a tansação for do mesmo tipo de entrada com o mesmo id de venda. Significa que a transação já existe
        const transactionExistsSeller =
          await this.prismaService.transactions.findFirst({
            where: {
              type: "deposit",
              typeInput: createBalanceDto.typeInput,
              saleId: createBalanceDto.saleId,
              value: createBalanceDto.value,
            },
          });

        if (transactionExistsSeller) {
          console.log(
            "Transação já existe:",
            JSON.stringify(transactionExistsSeller),
          );
          return;
        }

        return await this.prismaService.wallet.update({
          where: {
            id: wallet.id,
          },
          data: {
            balanceBlocked: (wallet.balanceBlocked +=
              createBalanceDto.valueBlocked),
            balanceToRelease: (wallet.balanceToRelease +=
              createBalanceDto.valueToRelease),
            balanceDisponilibity: (wallet.balanceDisponilibity +=
              createBalanceDto.valueDisponibility),
            transactions: {
              create: {
                saleId: createBalanceDto.saleId,
                code,
                type: "deposit",
                typeInput: "sallerCommission360",
                priceSale: createBalanceDto.priceSale,
                value: createBalanceDto.value,
                valueBlocked: createBalanceDto.valueBlocked,
                valueToRelease: createBalanceDto.valueToRelease,
                valueDisponilibity: createBalanceDto.valueDisponibility,
                date: new Date(),
                //dateUnlock: new Date(),
                // comission: createBalanceDto?.percentageComission || 0,
                referenceComissionSale: createBalanceDto.referenceComissionSale,
                balanceHistory: {
                  create: {
                    balanceBlocked: wallet.balanceBlocked,
                    balanceToRelease: wallet.balanceToRelease,
                    balanceDisponilibity: wallet.balanceDisponilibity,
                  },
                },
                adminId: createBalanceDto.sellerAdminId || null,
              },
            },
          },
        });

      // comissão 360 do afilaido
      case EnumTypeInput.affiliationCommission360:
        // se a tansação for do mesmo tipo de entrada com o mesmo id de venda. Significa que a transação já existe
        const transactionExistsAffiliation =
          await this.prismaService.transactions.findFirst({
            where: {
              type: "deposit",
              typeInput: createBalanceDto.typeInput,
              saleId: createBalanceDto.saleId,
              value: createBalanceDto.value,
            },
          });

        if (transactionExistsAffiliation) {
          console.log(
            "Transação já existe:",
            JSON.stringify(transactionExistsAffiliation),
          );
          return;
        }

        return await this.prismaService.wallet.update({
          where: {
            id: wallet.id,
          },
          data: {
            balanceBlocked: (wallet.balanceBlocked +=
              createBalanceDto.valueBlocked),
            balanceToRelease: (wallet.balanceToRelease +=
              createBalanceDto.valueToRelease),
            balanceDisponilibity: (wallet.balanceDisponilibity +=
              createBalanceDto.valueDisponibility),
            transactions: {
              create: {
                saleId: createBalanceDto.saleId,
                code,
                type: "deposit",
                typeInput: "affiliationCommission360",
                priceSale: createBalanceDto.priceSale,
                value: createBalanceDto.value,
                valueBlocked: createBalanceDto.valueBlocked,
                valueToRelease: createBalanceDto.valueToRelease,
                valueDisponilibity: createBalanceDto.valueDisponibility,
                date: new Date(),
                //dateUnlock: new Date(),
                // comission: createBalanceDto?.percentageComission || 0,
                referenceComissionSale: createBalanceDto.referenceComissionSale,
                balanceHistory: {
                  create: {
                    balanceBlocked: wallet.balanceBlocked,
                    balanceToRelease: wallet.balanceToRelease,
                    balanceDisponilibity: wallet.balanceDisponilibity,
                  },
                },
                adminId: createBalanceDto.sellerAdminId || null,
              },
            },
          },
        });

      // comissão do afiliado
      case EnumTypeInput.affiliationCommission:
        return await this.prismaService.wallet.update({
          where: {
            id: wallet.id,
          },
          data: {
            balanceBlocked: (wallet.balanceBlocked +=
              createBalanceDto.valueBlocked),
            balanceToRelease: (wallet.balanceToRelease +=
              createBalanceDto.valueToRelease),
            balanceDisponilibity: (wallet.balanceDisponilibity +=
              createBalanceDto.valueDisponibility),
            transactions: {
              create: {
                saleId: createBalanceDto.saleId,
                code,
                type: "deposit",
                typeInput: "affiliationCommission",
                priceSale: createBalanceDto.priceSale,
                value: createBalanceDto.value,
                valueBlocked: createBalanceDto.valueBlocked,
                valueToRelease: createBalanceDto.valueToRelease,
                valueDisponilibity: createBalanceDto.valueDisponibility,
                date: new Date(),
                dateUnlock: createBalanceDto.dateUnlock,
                dateUnlockAnticipation: createBalanceDto.dateUnlockAnticipation,
                releasedAnticipation: createBalanceDto.releasedAnticipation,

                // comission: createBalanceDto?.percentageComission || 0,
                referenceComissionSale: createBalanceDto.referenceComissionSale,
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
        });

      // comissão do vendedor
      case EnumTypeInput.sellerCommission:
        console.log("DTO:", createBalanceDto.typeSale);

        console.log(
          "Validate Pix:",
          createBalanceDto.typeSale === ETypeSaleTransaction.pix,
        );

        console.log(
          "Validate BankBillet:",
          createBalanceDto.typeSale === ETypeSaleTransaction.bankBillet,
        );

        console.log(
          createBalanceDto.typeSale === ETypeSaleTransaction.pix
            ? addDays(new Date(), 0)
            : createBalanceDto.typeSale === ETypeSaleTransaction.bankBillet
              ? addDays(new Date(), 0)
              : addDays(new Date(), 30),
        );

        return await this.prismaService.wallet.update({
          where: {
            id: wallet.id,
          },
          data: {
            balanceBlocked: (wallet.balanceBlocked +=
              createBalanceDto.valueBlocked),
            balanceToRelease: (wallet.balanceToRelease +=
              createBalanceDto.valueToRelease),
            balanceDisponilibity: (wallet.balanceDisponilibity +=
              createBalanceDto.valueDisponibility),
            transactions: {
              create: {
                saleId: createBalanceDto.saleId,
                code,
                type: "deposit",
                typeInput: "sellerCommission",
                priceSale: createBalanceDto.priceSale,
                value: createBalanceDto.value,
                valueBlocked: createBalanceDto.valueBlocked,
                valueToRelease: createBalanceDto.valueToRelease,
                valueDisponilibity: createBalanceDto.valueDisponibility,
                date: new Date(),
                dateUnlock: createBalanceDto.dateUnlock,
                dateUnlockAnticipation: createBalanceDto.dateUnlockAnticipation,
                releasedAnticipation: createBalanceDto.releasedAnticipation,

                // comission: createBalanceDto?.percentageComission || 0,
                referenceComissionSale: createBalanceDto.referenceComissionSale,
                balanceHistory: {
                  create: {
                    balanceBlocked: wallet.balanceBlocked,
                    balanceToRelease: wallet.balanceToRelease,
                    balanceDisponilibity: wallet.balanceDisponilibity,
                  },
                },
                adminId: createBalanceDto.sellerAdminId || null,
              },
            },
          },
        });

      case EnumTypeInput.financialReserve:
        return await this.prismaService.wallet.update({
          where: {
            id: wallet.id,
          },
          data: {
            balanceReserved: (wallet.balanceReserved += createBalanceDto.value),
            transactions: {
              create: {
                saleId: createBalanceDto.saleId,
                code,
                type: "deposit",
                typeInput: "financialReserve",
                priceSale: createBalanceDto.priceSale,
                value: createBalanceDto.value,
                date: new Date(),
                dateUnlock: createBalanceDto.releaseDays
                  ? addDays(new Date(), createBalanceDto.releaseDays)
                  : new Date(),
                referenceComissionSale: createBalanceDto.referenceComissionSale,
                balanceHistory: {
                  create: {
                    balanceBlocked: wallet.balanceBlocked,
                    balanceToRelease: wallet.balanceToRelease,
                    balanceDisponilibity: wallet.balanceDisponilibity,
                    balanceReserved: wallet.balanceReserved,
                  },
                },
                adminId: createBalanceDto.sellerAdminId || null,
              },
            },
          },
        });

      // comissão do co-produtor

      case EnumTypeInput.coProducerCommission:
        return await this.prismaService.wallet.update({
          where: {
            id: wallet.id,
          },
          data: {
            balanceBlocked: (wallet.balanceBlocked +=
              createBalanceDto.valueBlocked),
            balanceToRelease: (wallet.balanceToRelease +=
              createBalanceDto.valueToRelease),
            balanceDisponilibity: (wallet.balanceDisponilibity +=
              createBalanceDto.valueDisponibility),
            transactions: {
              create: {
                saleId: createBalanceDto.saleId,
                code,
                type: "deposit",
                typeInput: "coProducerCommission",
                priceSale: createBalanceDto.priceSale,
                value: createBalanceDto.value,
                valueBlocked: createBalanceDto.valueBlocked,
                valueToRelease: createBalanceDto.valueToRelease,
                valueDisponilibity: createBalanceDto.valueDisponibility,
                date: new Date(),
                dateUnlock: createBalanceDto.dateUnlock,
                dateUnlockAnticipation: createBalanceDto.dateUnlockAnticipation,
                releasedAnticipation: createBalanceDto.releasedAnticipation,

                referenceComissionSale: createBalanceDto.referenceComissionSale,
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
        });

      // cron disponibility
      case EnumTypeInput.releaseMoney:
        const valueToRelease = createBalanceDto.saleId
          ? createBalanceDto.valueToRelease
          : createBalanceDto.valueBlocked - createBalanceDto.valueToRelease;
        const hasValue =
          createBalanceDto.valueBlocked !== 0 ||
          valueToRelease !== 0 ||
          createBalanceDto.valueDisponibility !== 0;

        if (!hasValue) {
          return;
        }

        console.log("wallet ", wallet);

        return await this.prismaService.wallet.update({
          where: { id: wallet.id },
          data: {
            balanceBlocked: { decrement: createBalanceDto.valueBlocked },
            balanceToRelease: { increment: valueToRelease },
            balanceDisponilibity: {
              increment: createBalanceDto.valueDisponibility,
            },
            balanceReserved: {
              increment: createBalanceDto.valueReserved,
            },
            transactions: {
              create: {
                code: createBalanceDto.code ?? generateCodeTansaction(),
                date: new Date(),
                type: "movement",
                typeInput: "releaseMoney",
                priceSale: createBalanceDto.priceSale ?? 0,
                value: createBalanceDto.value ?? 0,
                ...(createBalanceDto.saleId && {
                  saleId: createBalanceDto.saleId,
                }),
                valueBlocked: createBalanceDto.valueBlocked
                  ? -createBalanceDto.valueBlocked
                  : 0,
                valueToRelease: valueToRelease,
                valueDisponilibity: createBalanceDto.valueDisponibility,
                valueReserved: createBalanceDto.valueReserved,
                balanceHistory: {
                  create: {
                    balanceBlocked: wallet.balanceBlocked,
                    balanceToRelease: wallet.balanceToRelease,
                    balanceDisponilibity: wallet.balanceDisponilibity,
                    balanceReserved: wallet.balanceReserved,
                  },
                },
              },
            },
          },
        });

      // cron create ads debit
      case EnumTypeInput.cardAds:
        return await this.prismaService.wallet.update({
          where: { id: wallet.id },
          data: {
            balanceBlocked: (wallet.balanceBlocked +=
              createBalanceDto.valueBlocked),
            balanceToRelease: (wallet.balanceToRelease +=
              createBalanceDto.valueToRelease),
            balanceDisponilibity: (wallet.balanceDisponilibity +=
              createBalanceDto.valueDisponibility),
            transactions: {
              create: {
                code: createBalanceDto.code ?? generateCodeTansaction(),
                date: new Date(),
                dateUnlock: createBalanceDto.dateUnlock,

                type: "debit",
                typeInput: "cardAds",
                priceSale: 0,
                value: 0,
                valueBlocked: createBalanceDto.valueBlocked,
                valueToRelease: 0,
                valueDisponilibity: 0,
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
        });

      // fluxo saque
      case EnumTypeInput.withdrawal:
        return this.prismaService.wallet.update({
          where: {
            id: wallet.id,
          },
          data: {
            balance: (wallet.balance += createBalanceDto.value),
            balanceDisponilibity: (wallet.balanceDisponilibity -=
              createBalanceDto.valueDisponibility),
            transactions: {
              create: {
                saleId: createBalanceDto.saleId,
                code,
                type: EnumTypeTransaction.debit,
                typeInput: EnumTypeInput.withdrawal,
                value: createBalanceDto.value,
                valueDisponilibity: createBalanceDto.valueDisponibility,
                date: new Date(),
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
        });

      // fluxo antecipação
      case EnumTypeInput.antecipation:
        if (
          createBalanceDto.requestStatusAntecipation ===
          EnumRequestStatusAntecipation.aproved
        ) {
          if (!createBalanceDto.referenceRequireId) {
            throw new Error();
          }
          const requestAntecipation =
            await this.prismaService.request.findFirst({
              where: {
                id: createBalanceDto.referenceRequireId,
              },
              include: {
                transactions: true,
              },
            });

          if (requestAntecipation.validate > new Date()) {
            throw new Error();
          }

          await this.prismaService.$transaction(
            requestAntecipation.transactions.map((post) =>
              this.prismaService.transactions.update({
                where: { id: post.id },
                data: { anteciped: true },
              }),
            ),
          );

          await this.prismaService.request.update({
            where: {
              id: createBalanceDto.referenceRequireId,
            },
            data: {
              status: EnumRequestStatusAntecipation.aproved,
              evaluatorEmail: createBalanceDto.emailAuditor,
              description: createBalanceDto.description,
            },
          });

          return this.prismaService.wallet.update({
            where: {
              id: wallet.id,
            },
            data: {
              balanceDisponilibity: (wallet.balanceDisponilibity +=
                createBalanceDto.valueDisponibility),
              balanceToRelease: (wallet.balanceToRelease -=
                createBalanceDto.value),
              transactions: {
                create: {
                  saleId: createBalanceDto.saleId,
                  code,
                  type: EnumTypeTransaction.movement,
                  typeInput: EnumTypeInput.antecipation,
                  priceSale: 0,
                  value: 0,
                  valueToRelease: createBalanceDto.valueToRelease,
                  valueDisponilibity: createBalanceDto.valueDisponibility,
                  date: new Date(),
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
          });
        }
        if (
          createBalanceDto.requestStatusAntecipation ===
          EnumRequestStatusAntecipation.denied
        ) {
          await this.prismaService.request.update({
            where: {
              id: createBalanceDto.referenceRequireId,
            },
            data: {
              status: EnumRequestStatusAntecipation.denied,
            },
          });
        }

      // fluxo de chargeback
      case EnumTypeInput.chargeback:
        const inputChargeback = plainToInstance(
          ChargebackDto,
          createBalanceDto,
        );

        const validateInputChargeback = await validator.validate(
          inputChargeback,
          {},
        );

        if (validateInputChargeback.length)
          throw `Erro dto chargeback. ${JSON.stringify(
            validateInputChargeback,
            undefined,
            2,
          )}`;

        return await this.prismaService.wallet.update({
          where: { id: wallet.id },
          data: {
            balanceDisponilibity: (wallet.balanceDisponilibity +=
              createBalanceDto.valueDisponibility),
            transactions: {
              create: {
                code: createBalanceDto.code ?? generateCodeTansaction(),
                saleId: createBalanceDto.saleId,
                date: new Date(),
                type: "debit",
                typeInput: "chargeback",
                priceSale: createBalanceDto.priceSale,
                value: createBalanceDto.value,
                valueBlocked: 0,
                valueToRelease: 0,
                valueDisponilibity: createBalanceDto.valueDisponibility,
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
        });

      // fluxo reembolso
      case EnumTypeInput.saleRefund:
        const inputSaleRefund = plainToInstance(
          SaleRefundDto,
          createBalanceDto,
        );

        const validateInputSaleRefund = await validator.validate(
          inputSaleRefund,
          {},
        );

        if (validateInputSaleRefund.length)
          throw `Erro dto SaleRefund. ${JSON.stringify(
            validateInputSaleRefund,
            undefined,
            2,
          )}`;

        const transactionBody: Omit<Prisma.TransactionsCreateInput, "wallet"> =
          {
            code: createBalanceDto.code ?? generateCodeTansaction(),
            saleId: createBalanceDto.saleId,
            date: new Date(),
            type: "debit",
            typeInput: "saleRefund",
            priceSale: createBalanceDto.priceSale,
            value: createBalanceDto.value,
            balanceHistory: {
              create: {
                balanceBlocked: wallet.balanceBlocked,
                balanceToRelease: wallet.balanceToRelease,
                balanceDisponilibity: wallet.balanceDisponilibity,
              },
            },
          };
        const walletBody: Prisma.WalletUpdateInput = {};
        // const chargeFromDisponibility =
        //   wallet.balanceDisponilibity >= createBalanceDto.value;
        // const chargeFromToRelease = inputSaleRefund.chargeFromReceivable === true && wallet.balanceToRelease >= createBalanceDto.priceSale
        // const chargeReserved = inputSaleRefund.chargeFromReserve === true &&
        //  wallet.balanceReserved >= createBalanceDto.priceSale
        // const chargeDoesntHaveBalance =
        //   !chargeFromDisponibility && !chargeReserved;
        //if (chargeFromDisponibility || chargeDoesntHaveBalance) // TODO mudar o if abaixo para o comentado quando as outras cobranças serem implementadas
        // if (chargeFromDisponibility || chargeDoesntHaveBalance) {
        //   walletBody.balanceDisponilibity = wallet.balanceDisponilibity +=
        //     createBalanceDto.priceSale;
        //   transactionBody.valueDisponilibity = createBalanceDto.priceSale;
        // }
        // else if (chargeReserved) {
        //   walletBody.balanceReserved = wallet.balanceReserved +=
        //     createBalanceDto.priceSale;
        // } else if (chargeFromToRelease) {
        //   walletBody.balanceToRelease = wallet.balanceToRelease +=
        //     createBalanceDto.priceSale;
        //   transactionBody.valueToRelease = createBalanceDto.priceSale;
        // }
        walletBody.balanceDisponilibity = wallet.balanceDisponilibity +=
          createBalanceDto.value;
        transactionBody.valueDisponilibity = createBalanceDto.value;
        return await this.prismaService.wallet.update({
          where: { id: wallet.id },
          data: {
            ...walletBody,
            transactions: {
              create: transactionBody,
            },
          },
        });

      // fluxo de recarga da carteira
      case EnumTypeInput.recharge:
        const inputRecharge = plainToInstance(RechargeDto, createBalanceDto);

        const validateInputRecharge = await validator.validate(
          inputRecharge,
          {},
        );

        if (validateInputRecharge.length)
          throw `Erro dto recharge. ${JSON.stringify(
            validateInputRecharge,
            undefined,
            2,
          )}`;

        return await this.prismaService.wallet.update({
          where: { id: wallet.id },
          data: {
            balanceDisponilibity: (wallet.balanceDisponilibity +=
              createBalanceDto.valueDisponibility),
            transactions: {
              create: {
                code: createBalanceDto.code ?? generateCodeTansaction(),
                rechargeId: createBalanceDto.rechargeId,
                date: new Date(),
                type: "deposit",
                typeInput: "recharge",
                value: createBalanceDto.value,
                valueBlocked: 0,
                valueToRelease: 0,
                valueDisponilibity: createBalanceDto.valueDisponibility,
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
        });

      // fluxo de recarga de cartão com o saldo da carteira
      case EnumTypeInput.rechargeCard:
        const taxRechargeCard = Number(process.env.TAX_RECHARGE_CARD);
        const valueRechargeAndTax =
          createBalanceDto.valueDisponibility + -taxRechargeCard;

        const inputRechargeCard = plainToInstance(
          RechargeCardDto,
          createBalanceDto,
        );

        const validateInputRechargeCard = await validator.validate(
          inputRechargeCard,
          {},
        );

        if (validateInputRechargeCard.length)
          throw `Erro dto recharge. ${JSON.stringify(
            validateInputRechargeCard,
            undefined,
            2,
          )}`;

        return await this.prismaService.wallet.update({
          where: { id: wallet.id },
          data: {
            balanceDisponilibity: (wallet.balanceDisponilibity +=
              valueRechargeAndTax),
            transactions: {
              create: {
                code: createBalanceDto.code ?? generateCodeTansaction(),
                date: new Date(),
                type: "debit",
                typeInput: "rechargeCard",
                value: createBalanceDto.value,
                valueBlocked: 0,
                valueToRelease: 0,
                valueDisponilibity: valueRechargeAndTax,
                tax: taxRechargeCard,
                card: {
                  connect: {
                    id: inputRechargeCard.cardId,
                  },
                },
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
        });

      // Fluxo de recarregar a carteira com o saldo do cartão
      case EnumTypeInput.dischargeCard:
        const taxDischargeCard = 0;
        const valueDischargeAndTax = createBalanceDto.valueDisponibility;

        const inputDischargeCard = plainToInstance(
          DischargeCardDto,
          createBalanceDto,
        );

        const validateInputDischargeCard = await validator.validate(
          inputDischargeCard,
          {},
        );

        if (validateInputDischargeCard.length)
          throw `Erro dto discharge. ${JSON.stringify(
            validateInputDischargeCard,
            undefined,
            2,
          )}`;

        return await this.prismaService.wallet.update({
          where: { id: wallet.id },
          data: {
            balanceDisponilibity: (wallet.balanceDisponilibity +=
              valueDischargeAndTax),
            transactions: {
              create: {
                code: createBalanceDto.code ?? generateCodeTansaction(),
                date: new Date(),
                type: "deposit",
                typeInput: "dischargeCard",
                value: createBalanceDto.value,
                valueBlocked: 0,
                valueToRelease: 0,
                valueDisponilibity: valueDischargeAndTax,
                tax: taxDischargeCard,
                card: {
                  connect: {
                    id: inputDischargeCard.cardId,
                  },
                },
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
        });

      case EnumTypeInput.manualTransaction:
        return await this.prismaService.wallet.update({
          where: { id: wallet.id },
          data: {
            balanceDisponilibity: {
              increment: createBalanceDto.valueDisponibility,
            },
            balanceReserved: {
              increment: createBalanceDto.valueReserved,
            },
            balanceToRelease: {
              increment: createBalanceDto.valueToRelease,
            },
            balanceBlocked: {
              increment: createBalanceDto.valueBlocked,
            },
            transactions: {
              create: {
                code: createBalanceDto.code ?? generateCodeTansaction(),
                date: new Date(),
                type: createBalanceDto.type,
                typeInput: EnumTypeInput.manualTransaction,
                value: createBalanceDto.value,
                valueBlocked: createBalanceDto.valueBlocked,
                valueToRelease: createBalanceDto.valueToRelease,
                valueDisponilibity: createBalanceDto.valueDisponibility,
                valueReserved: createBalanceDto.valueReserved,
                description: createBalanceDto.description,
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
        });

      case EnumTypeInput.preChargebackAlert: // Débito do alerta de pré chargeback do seller
        const inputPreChargeback = plainToInstance(
          PreChargebackAlertDto,
          createBalanceDto,
        );
        const validateInputPreChargeback =
          await this.isValidInputPreChargebackAlert(inputPreChargeback);
        if (validateInputPreChargeback.length)
          throw `Erro dto pre chargeback. ${JSON.stringify(
            validateInputPreChargeback,
            undefined,
            2,
          )}`;

        return await this.prismaService.wallet.update({
          where: { id: wallet.id },
          data: {
            balanceDisponilibity: (wallet.balanceDisponilibity -=
              createBalanceDto.valueDisponibility),
            transactions: {
              create: {
                code: createBalanceDto.code ?? generateCodeTansaction(),
                date: new Date(),
                type: "debit",
                typeInput: "preChargebackAlert",
                priceSale: createBalanceDto.priceSale,
                value: createBalanceDto.value,
                valueBlocked: 0,
                valueToRelease: 0,
                valueDisponilibity: createBalanceDto.valueDisponibility,
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
        });
      case EnumTypeInput.preChargebackAlertCommission: // Adição do valor do pré chargeback para carteira do admin
        const inputPreChargebackCommission = plainToInstance(
          PreChargebackAlertDto,
          createBalanceDto,
        );
        const validateInputPreChargebackComission =
          await this.isValidInputPreChargebackAlert(
            inputPreChargebackCommission,
          );
        if (validateInputPreChargebackComission.length)
          throw `Erro dto pre chargeback. ${JSON.stringify(
            validateInputPreChargebackComission,
            undefined,
            2,
          )}`;
        return await this.prismaService.wallet.update({
          where: { id: wallet.id },
          data: {
            balanceDisponilibity: (wallet.balanceDisponilibity +=
              createBalanceDto.valueDisponibility),
            transactions: {
              create: {
                code: createBalanceDto.code ?? generateCodeTansaction(),
                date: new Date(),
                type: "deposit",
                typeInput: "preChargebackAlertCommission",
                priceSale: createBalanceDto.priceSale,
                value: createBalanceDto.value,
                valueBlocked: 0,
                valueToRelease: 0,
                valueDisponilibity: createBalanceDto.valueDisponibility,
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
        });
      default:
        throw "type input invalid";
    }
  }

  findAll() {
    return `This action returns all balance`;
  }

  findOne(id: number) {
    return `This action returns a #${id} balance`;
  }

  update(id: number, updateBalanceDto: UpdateBalanceDto) {
    return `This action updates a #${id} balance`;
  }

  remove(id: number) {
    return `This action removes a #${id} balance`;
  }
}
