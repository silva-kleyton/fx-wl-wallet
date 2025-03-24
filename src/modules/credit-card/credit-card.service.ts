import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  EnumTypeInput,
  EnumTypePerson,
  EnumTypeTransaction,
  Prisma,
} from "@prisma/client";
import { differenceInHours, parseISO, subHours } from "date-fns";
import { format, formatInTimeZone } from "date-fns-tz";
import { BadRequestError } from "passport-headerapikey";
import { Producer } from "sqs-producer";
import { PrismaService } from "../../prisma/prisma.service";
import { CoreService } from "../../services/core/core.service";
import { CreateCardBrokerDto } from "../../services/niky/dto/create-card-broker.dto";
import { NikyService } from "../../services/niky/niky.service";
import { convertIntegerToFloat } from "../../utils/convert/convert-integer-to-float";
import { parseNegativeValueToPositive } from "../../utils/convert/convert-negative-value-in-positive";
import { CreateCardOffFlowDto } from "./dto/create-card-off-flow.dto";
import { CreateCreditCardNewDto } from "./dto/create-credit-card-new.dto";
import { CreateCreditCardDto } from "./dto/create-credit-card.dto";
import { DischargeCardRequestDto } from "./dto/discharge-request-card.dto";
import { RechargeCardDto } from "./dto/recharge-card.dto";
import { UpdateCreditCardDto } from "./dto/update-credit-card.dto";

@Injectable()
export class CreditCardService {
  constructor(
    private readonly nikyService: NikyService,
    private readonly coreService: CoreService,
    private readonly prismaService: PrismaService,
  ) {}

  async create(createCreditCardDto: CreateCreditCardDto, username: string) {
    const user = await this.coreService.getUserByEmail(username);

    if (!user) throw new NotFoundException("user not found");

    let wallet = await this.prismaService.wallet.findFirst({
      where: { user: user.id },
      include: { userInfo: true },
    });

    // caso o usuário não possua uma carteira criar a wallet.
    if (!wallet) {
      wallet = await this.prismaService.wallet.create({
        data: {
          user: user.id,
          userInfo: {
            create: {
              cpf: createCreditCardDto.cpf,
            },
          },
        },
        include: {
          userInfo: true,
        },
      });
    }

    // payload de criação da Niky
    // const createCardNiky: CreateCardNikyDto = {
    //   dataExecucao: new Date().toISOString().split("T")[0],
    //   idAgencia: "0001",
    //   quantidadeTotal: 1,
    //   itens: [
    //     {
    //       codigoItemAgencia: 1,
    //       cartao: {
    //         produto: {
    //           codigoProduto: "H360BN001",
    //           cartaoVirtual: createCreditCardDto.card.virtual,
    //         },
    //         portador: {
    //           nome: createCreditCardDto.name,
    //           celularContato: createCreditCardDto.cellPhone,
    //           cpf: createCreditCardDto.cpf,
    //           emailContato: user.email,
    //           dataNascimento: createCreditCardDto.birthDate,
    //           nomeMae: createCreditCardDto.nameMother,
    //           codigoAreaCelular: createCreditCardDto.cellPhone.substring(0, 2),
    //           numeroCelular: createCreditCardDto.cellPhone.substring(
    //             createCreditCardDto.cellPhone.length === 10
    //               ? createCreditCardDto.cellPhone.length - 8
    //               : createCreditCardDto.cellPhone.length - 9
    //           ),
    //         },
    //       },
    //     },
    //   ],
    // };

    // adicionar em transactions

    // se o cartão for fisíco. Irá retirar R$29,90 do saldo disponível da carteira do usuário.
    if (!createCreditCardDto.card.virtual) {
      if (wallet.balanceDisponilibity < 2990)
        throw new BadRequestError("Don't have enough balance");

      // criar transação para o cartão... com type saque
    }

    const { nikySession } = await this.prismaService.configService.findFirst();

    const payloadCreateCardNikyBroker =
      this.nikyService.convertPayloadCreateCreditCardBroker(
        {
          email: user.email,
          aproved: user.ValidationDocumentCompany,
          documentCNPJ: user.company?.document,
          address: {
            zipcode: user.address.zipcode,
            street: user.address.street,
            number: user.address.number,
            state: user.address.state,
            neighborhood: user.address.neighborhood,
            city: user.address.city,
            complement: user.address.complement ?? "",
          },
        },
        createCreditCardDto,
        nikySession,
      );

    const dataFormJson: Prisma.InputJsonObject = JSON.parse(
      JSON.stringify(payloadCreateCardNikyBroker),
    );

    if (!wallet.userInfo) {
      await this.prismaService.userInfo.create({
        data: {
          cpf: createCreditCardDto.cpf,
          walletId: wallet.id,
          form: dataFormJson,
        },
      });
    }

    // salvar o formulário
    if (wallet.userInfo && !wallet.userInfo.form) {
      await this.prismaService.userInfo.update({
        where: { walletId: wallet.id },
        data: { form: dataFormJson },
      });
    }

    const card = await this.nikyService.createCardBroker(
      payloadCreateCardNikyBroker,
      wallet.id,
    );

    return await this.prismaService.$transaction(async (prisma) => {
      if (wallet.userInfo) {
        await prisma.userInfo.update({
          where: { walletId: wallet.id },
          data: { form: dataFormJson },
        });
      }

      return await prisma.card.create({
        data: {
          providerId: card.panVas,
          providerCodeRequest: card.codeRequest,
          name: createCreditCardDto.card.name,
          typePerson: payloadCreateCardNikyBroker.content.requestRelation
            ?.fourthLine
            ? EnumTypePerson.PJ
            : EnumTypePerson.PF,
          wallet: {
            connect: {
              id: wallet.id,
            },
          },
        },
      });
    });
  }

  // criar um novo cartão, utilizando dados existentes.
  async createCardNew(
    createCreditCardNewDto: CreateCreditCardNewDto,
    username: string,
  ) {
    const user = await this.coreService.getUserByEmail(username);

    if (!user) throw new NotFoundException("user not found");

    const wallet = await this.prismaService.wallet.findFirst({
      where: { user: user.id },
      include: { userInfo: true },
    });

    // se o cartão for fisíco. Irá retirar R$29,90 do saldo disponível da carteira do usuário.
    if (!createCreditCardNewDto.card.virtual) {
      if (wallet.balanceDisponilibity < 2990)
        throw new BadRequestError("Don't have enough balance");

      // criar transação para o cartão... com type saque
    }

    const { nikySession } = await this.prismaService.configService.findFirst();

    const { content } = <CreateCardBrokerDto>(
      JSON.parse(JSON.stringify(wallet.userInfo.form))
    );

    const payloadCreateCardNikyBroker: CreateCardBrokerDto = {
      tokenCode: nikySession,
      content,
    };

    const card = await this.nikyService.createCardBroker(
      payloadCreateCardNikyBroker,
      wallet.id,
    );

    return await this.prismaService.card.create({
      data: {
        providerId: card.panVas,
        providerCodeRequest: card.codeRequest,
        name: createCreditCardNewDto.card.name,
        wallet: {
          connect: {
            id: wallet.id,
          },
        },
      },
    });
  }

  async createCardOffFlow(createCardOffFlowDto: CreateCardOffFlowDto) {
    const user = await this.coreService.getUserByEmail(
      createCardOffFlowDto.email,
    );

    if (!user) throw new NotFoundException("user not found");

    let wallet = await this.prismaService.wallet.findFirst({
      where: { user: user.id },
      include: { userInfo: true },
    });

    // caso o usuário não possua uma carteira criar a wallet.
    if (!wallet) {
      wallet = await this.prismaService.wallet.create({
        data: {
          user: user.id,
          userInfo: {
            create: {
              cpf: user.cpf,
            },
          },
        },
        include: {
          userInfo: true,
        },
      });
    }

    if (!wallet.userInfo) {
      await this.prismaService.userInfo.create({
        data: {
          cpf: user.cpf,
          walletId: wallet.id,
        },
      });
    }

    return this.prismaService.card.create({
      data: {
        providerId: createCardOffFlowDto.panVas,
        providerCodeRequest: createCardOffFlowDto.codeRequest,
        name: createCardOffFlowDto.name,
        wallet: {
          connect: {
            id: wallet.id,
          },
        },
      },
    });
  }

  async findDetailCard(cardId: string) {
    const card = await this.prismaService.card.findFirst({
      where: { providerId: cardId },
      include: {
        wallet: {
          include: { userInfo: true },
        },
      },
    });

    if (!card) throw new NotFoundException("Card not found");

    const responseNiky = await this.nikyService.getNumberAndCvvCard(
      card.providerCodeRequest,
    );

    const infoCard = await this.nikyService.CardInformation(
      card.wallet.userInfo.cpf,
      card.providerId,
    );

    return {
      nameCard: card.name,
      ...responseNiky,
      infoCard,
    };
  }

  async activateCard(cardId: string) {
    const card = await this.prismaService.card.findFirst({
      where: { providerId: cardId },
    });

    if (!card) throw new NotFoundException("Card not found");

    return this.nikyService.activateCardBroker(card.providerCodeRequest);
  }

  async movementsCard(cardId: string) {
    const card = await this.prismaService.card.findFirst({
      where: { providerId: cardId },
    });

    if (!card) throw new NotFoundException("Card not found");

    return this.nikyService.consultMovementsCard(card.providerId);
  }

  async blockCard(cardId: string) {
    const card = await this.prismaService.card.findFirst({
      where: { providerId: cardId },
    });

    if (!card) throw new NotFoundException("Card not found");

    return this.nikyService.blockCard(card.providerCodeRequest);
  }

  async unlockCard(cardId: string) {
    const card = await this.prismaService.card.findFirst({
      where: { providerId: cardId },
    });

    if (!card) throw new NotFoundException("Card not found");

    return this.nikyService.unlockCard(card.providerCodeRequest);
  }

  async update(cardId: string, updateCreditCardDto: UpdateCreditCardDto) {
    const card = await this.prismaService.card.findFirst({
      where: { providerId: cardId },
    });

    if (updateCreditCardDto.name.length <= 3)
      throw new BadRequestException("Name card required more 3 caracteres");

    if (!card) throw new NotFoundException("Card not found");

    return this.prismaService.card.update({
      where: { id: card.id },
      data: { name: updateCreditCardDto.name },
    });
  }

  async rechargeCard(rechargeCardDto: RechargeCardDto) {
    console.log("rechargeCard method");
    const card = await this.prismaService.card.findFirst({
      where: { providerId: rechargeCardDto.cardId },
      include: {
        wallet: {
          include: {
            userInfo: true,
          },
        },
      },
    });

    if (!card) throw new NotFoundException("Card not found");

    const infoCard = await this.nikyService.CardInformation(
      card.wallet.userInfo.cpf,
      card.providerId,
    );
    console.log(infoCard);
    if (infoCard.status === "Bloqueado")
      throw new BadRequestException("Card is blocked");

    if (
      card.wallet.balanceDisponilibity <
      rechargeCardDto.value + Number(process.env.TAX_RECHARGE_CARD)
    )
      throw new BadRequestException("Insufficient funds");

    const { data } = await this.nikyService.createRecharge({
      idAgencia: "45744511000156",
      dataExecucao: format(subHours(new Date(), 3), "yyyy-MM-dd"),
      codigoLoteAgencia: "01",
      descricaoLoteAgencia: `Recharge card id: ${card.id}`,
      valorTotal: convertIntegerToFloat(rechargeCardDto.value),
      quantidadeTotal: 1,
      recargas: [
        {
          codigoItemAgencia: 1,
          descricaoItemAgencia: `Recarga do cartão ${card.name}`,
          cartaoDestinatario: `${card.providerId}`,
          cpfDestinatario: `${card.wallet.userInfo.cpf}`,
          valorRecarga: convertIntegerToFloat(rechargeCardDto.value),
        },
      ],
    });
    console.log("Dados do cartao", data);
    const producer = Producer.create({
      queueUrl: `${process.env.URL_QUEUE_INPUT_WALLET_TRANSACTION}`,
      region: `${process.env.AWS_REGION_APP}`,
    });

    console.log(
      "recharge antes do producer",
      JSON.stringify({
        userId: card.wallet.user,
        typeInput: EnumTypeInput.rechargeCard,
        value: -rechargeCardDto.value,
        type: EnumTypeTransaction.debit,
        cardId: card.id,
        date: new Date(),
        valueToRelease: 0,
        valueBlocked: 0,
        valueDisponibility: -rechargeCardDto.value,
        priceSale: null,
      }),
    );
    await producer.send({
      id: card.wallet.user,
      groupId: card.wallet.user,
      body: JSON.stringify({
        userId: card.wallet.user,
        typeInput: EnumTypeInput.rechargeCard,
        value: -rechargeCardDto.value,
        type: EnumTypeTransaction.debit,
        cardId: card.id,
        date: new Date(),
        valueToRelease: 0,
        valueBlocked: 0,
        valueDisponibility: -rechargeCardDto.value,
        priceSale: null,
      }),
    });

    return data;
  }

  async dischargeCard(dischargeCardRequestDto: DischargeCardRequestDto) {
    console.log("dischargeCard method");
    const card = await this.prismaService.card.findFirst({
      where: { providerId: dischargeCardRequestDto.cardId },
      include: {
        wallet: {
          include: {
            userInfo: true,
          },
        },
      },
    });

    if (!card) throw new NotFoundException("Card not found");

    const infoCard = await this.nikyService.CardInformation(
      card.wallet.userInfo.cpf,
      card.providerId,
    );

    if (infoCard.status === "Bloqueado")
      throw new BadRequestException("Card is blocked");

    if (
      convertIntegerToFloat(
        parseNegativeValueToPositive(dischargeCardRequestDto.value),
      ) > infoCard.saldo
    )
      throw new BadRequestException("Insufficient funds card");

    const last24DischargeTime = await this.prismaService.transactions.findFirst(
      {
        where: {
          cardId: card.id,
          typeInput: EnumTypeInput.dischargeCard,
        },
        select: {
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    );

    if (last24DischargeTime != null) {
      const actualDate = new Date(
        parseISO(
          formatInTimeZone(
            new Date(),
            "America/Sao_Paulo",
            "yyyy-MM-dd HH:mm:ss",
          ),
        ),
      );
      const last24Discharge = differenceInHours(
        actualDate,
        new Date(last24DischargeTime.createdAt),
      );
      if (last24Discharge <= 23)
        throw new BadRequestException(
          "You can only make one discharge per day",
        );
    }

    const { data } = await this.nikyService.createDischarge({
      idAgencia: "45744511000156",
      dataExecucao: format(subHours(new Date(), 3), "yyyy-MM-dd"),
      codigoLoteAgencia: "01",
      descricaoLoteAgencia: `Discharge card id: ${card.id}`,
      valorTotal: convertIntegerToFloat(
        parseNegativeValueToPositive(dischargeCardRequestDto.value),
      ),
      quantidadeTotal: 1,
      tipoLote: 2,
      descargas: [
        {
          codigoItemAgencia: 1,
          descricaoItemAgencia: `Recarga do cartão ${card.name}`,
          cartaoDestinatario: `${card.providerId}`,
          cpfDestinatario: `${card.wallet.userInfo.cpf}`,
          valorDescarga: convertIntegerToFloat(
            parseNegativeValueToPositive(dischargeCardRequestDto.value),
          ),
          // idItemRecarga: 0,
        },
      ],
    });

    const producer = Producer.create({
      queueUrl: `${process.env.URL_QUEUE_INPUT_WALLET_TRANSACTION}`,
      region: `${process.env.AWS_REGION_APP}`,
    });

    console.log("estou no discharge antes do producer");
    console.log(
      "discharge msg pro input-wallet",
      JSON.stringify({
        userId: card.wallet.user,
        typeInput: EnumTypeInput.dischargeCard,
        value: parseNegativeValueToPositive(dischargeCardRequestDto.value),
        type: EnumTypeTransaction.deposit,
        cardId: card.id,
        date: new Date(),
        valueToRelease: 0,
        valueBlocked: 0,
        valueDisponibility: parseNegativeValueToPositive(
          dischargeCardRequestDto.value,
        ),
        priceSale: null,
      }),
    );
    await producer.send({
      id: card.wallet.user,
      groupId: card.wallet.user,
      body: JSON.stringify({
        userId: card.wallet.user,
        typeInput: EnumTypeInput.dischargeCard,
        value: parseNegativeValueToPositive(dischargeCardRequestDto.value),
        type: EnumTypeTransaction.deposit,
        cardId: card.id,
        date: new Date(),
        valueToRelease: 0,
        valueBlocked: 0,
        valueDisponibility: parseNegativeValueToPositive(
          dischargeCardRequestDto.value,
        ),
        priceSale: null,
      }),
    });

    return data;
  }

  remove(id: number) {
    return `This action removes a #${id} creditCard`;
  }
}
