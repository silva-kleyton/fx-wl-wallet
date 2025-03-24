import { BadRequestException, Injectable } from "@nestjs/common";
import axios from "axios";
import { CreateCreditCardDto } from "../../modules/credit-card/dto/create-credit-card.dto";
import { PrismaService } from "../../prisma/prisma.service";
import removeMaskRG from "../../utils/mask/remove-mask";
import { CreateCardBrokerDto } from "./dto/create-card-broker.dto";
import { CreateCardNikyDto } from "./dto/create-card.dto";
import { CreateDischargeDto } from "./dto/create-discharge.dto";
import { CreateLotOfCardsDto } from "./dto/create-lot-of-cards.dto";
import { CreateRechargeDto } from "./dto/create-recharge.dto";
import { UnlinkCardsDto } from "./dto/unlink-cards.dto";
import { UpdateBearerDataDto } from "./dto/update-bearer-data.dto";
import { UpdateChargeStatusDto } from "./dto/update-charge-status.dto";
import { UpdateDischargeStatusDto } from "./dto/update-discharge-status.dto";

@Injectable()
export class NikyService {
  constructor(private readonly prismaService: PrismaService) {}

  async authenticate() {
    try {
      const headers = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-api-key": `${process.env.NIKY_API_KEY}`,
        },
      };

      const data = {
        usuario: `${process.env.USER_NIKY}`,
        senha: `${process.env.PASS_NIKY}`,
      };

      const login = await axios.post(
        `${process.env.BASE_URL_NIKY}/autenticacao/login`,
        data,
        headers
      );
      if (login?.data?.idSessao) {
        const config = await this.prismaService.configService.findFirst();
        if (config) {
          await this.prismaService.configService.update({
            where: {
              id: config.id,
            },
            data: {
              nikySession: login.data.idSessao,
            },
          });
        } else {
          await this.prismaService.configService.create({
            data: {
              nikySession: login.data.idSessao,
            },
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Recarga do cartão
  async createRecharge(data: CreateRechargeDto) {
    try {
      const config = await this.prismaService.configService.findFirst();

      if (config?.nikySession) {
        const dataRechargeCard: CreateRechargeDto = {
          idAgencia: data.idAgencia, //CNPJ da conta master da agência de incentivo. Deve ser o mesmo utilizado na realização do login no Portal de Incentivos.
          dataExecucao: data.dataExecucao, //Data programada para o processamento do lote de recarga. A data corrente enviará o lote para processamento.
          codigoLoteAgencia: data.codigoLoteAgencia, //Código identificador do lote na agência de incentivo.
          descricaoLoteAgencia: data.descricaoLoteAgencia, //Texto amigável para identificação do lote na agência. Se não informado, a descrição será a mesma do codigoLoteAgencia.
          valorTotal: data.valorTotal, //Soma do valor dos itens de recarga enviados no lote. Este valor será utilizado para validar se o valor indicado é compatível com a soma dos itens enviados no lote.
          quantidadeTotal: data.quantidadeTotal, //Quantidade total dos itens de recarga enviados no lote. Este valor será utilizado para validar se a quantidade indicada é compatível com a contagem dos itens enviados no lote.
          recargas: [
            {
              codigoItemAgencia: data.recargas[0].codigoItemAgencia, //Código identificador da recarga na agência de incentivos.
              descricaoItemAgencia: data.recargas[0].descricaoItemAgencia, //Texto identificador da recarga na agência de incentivos
              cartaoDestinatario: data.recargas[0].cartaoDestinatario, //Código do cartão que receberá o crédito em conta.
              cpfDestinatario: data.recargas[0].cpfDestinatario, //CPF do portador do cartão que receberá o crédito em conta.
              valorRecarga: data.recargas[0].valorRecarga, //Valor da recarga a ser realizada.
            },
          ],
        };
        const createRecharge = await axios.post(
          `${process.env.BASE_URL_NIKY}/recarga`,
          dataRechargeCard,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "X-API-Key": `${process.env.NIKY_API_KEY}`,
              idSessao: config.nikySession,
            },
          }
        );

        return createRecharge;
      } else {
        throw new Error("Erro ao autenticar");
      }
    } catch (error) {
      console.error(error);
      throw "error ao carregar cartão na niky";
    }
  }

  async listRecharges() {
    try {
      const config = await this.prismaService.configService.findFirst();
      if (config?.nikySession) {
        const listRecharge = await axios.get(
          `${process.env.BASE_URL_NIKY}/recarga`,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "X-API-Key": `${process.env.NIKY_API_KEY}`,
              idSessao: config.nikySession,
            },
          }
        );
        return listRecharge;
      } else {
        throw new Error("Erro ao autenticar");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async cancelRecharge(rechargeId: string) {
    try {
      const config = await this.prismaService.configService.findFirst();
      if (config?.nikySession) {
        const cancelRecharge = await axios.put(
          `${process.env.BASE_URL_NIKY}/recarga/${rechargeId}/cancelar`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "X-API-Key": `${process.env.NIKY_API_KEY}`,
              idSessao: config.nikySession,
            },
          }
        );
        return cancelRecharge;
      } else {
        throw new Error("Erro ao autenticar");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async listDetailsRecharge(rechargeId: string) {
    try {
      const config = await this.prismaService.configService.findFirst();
      if (config?.nikySession) {
        const listDetailsRecharge = await axios.get(
          `${process.env.BASE_URL_NIKY}/recarga/${rechargeId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "X-API-Key": `${process.env.NIKY_API_KEY}`,
              idSessao: config.nikySession,
            },
          }
        );
        return listDetailsRecharge;
      } else {
        throw new Error("Erro ao autenticar");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async listItensRecharge() {
    try {
      const config = await this.prismaService.configService.findFirst();
      if (config?.nikySession) {
        const listItensRecharge = await axios.get(
          `${process.env.BASE_URL_NIKY}/item-recarga`,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "X-API-Key": `${process.env.NIKY_API_KEY}`,
              idSessao: config.nikySession,
            },
          }
        );
        return listItensRecharge;
      } else {
        throw new Error("Erro ao autenticar");
      }
    } catch (error) {
      console.log(error);
    }
  }

  /** Criarção de descarga no cartão */
  async createDischarge(createDischargeDto: CreateDischargeDto) {
    try {
      const config = await this.prismaService.configService.findFirst();
      if (config?.nikySession) {
        const data: CreateDischargeDto = {
          idAgencia: createDischargeDto.idAgencia, //CNPJ da conta master da agência de incentivo. Deve ser o mesmo utilizado na realização do login no Portal de Incentivos.
          dataExecucao: createDischargeDto.dataExecucao, //Data programada para o processamento do lote de recarga. A data corrente enviará o lote para processamento.
          codigoLoteAgencia: createDischargeDto.codigoLoteAgencia, //Código identificador do lote na agência de incentivo.
          descricaoLoteAgencia: createDischargeDto.descricaoLoteAgencia, //Texto amigável para identificação do lote na agência. Se não informado, a descrição será a mesma do codigoLoteAgencia.
          tipoLote: createDischargeDto.tipoLote, //Tipo de lote de descarga. Os valores possíveis são: 1 - Cancelamento de carga; 2 - Descarga de saldo parcial; 3 - Descarga de saldo total.
          valorTotal: createDischargeDto.valorTotal, //Soma do valor dos itens de recarga enviados no lote. Este valor será utilizado para validar se o valor indicado é compatível com a soma dos itens enviados no lote.
          quantidadeTotal: createDischargeDto.quantidadeTotal, //Quantidade total dos itens de recarga enviados no lote. Este valor será utilizado para validar se a quantidade indicada é compatível com a contagem dos itens enviados no lote.
          descargas: [
            {
              codigoItemAgencia:
                createDischargeDto.descargas[0].codigoItemAgencia, //Código identificador da recarga na agência de incentivos.
              descricaoItemAgencia:
                createDischargeDto.descargas[0].descricaoItemAgencia, //Texto identificador da recarga na agência de incentivos
              idItemRecarga: createDischargeDto.descargas[0].idItemRecarga, //Código identificador único do item de recarga atribuído pela Niky. Deve ser preenchido obrigatoriamente quando o tipoLote for 1 (Cancelamento de carga).
              cartaoDestinatario:
                createDischargeDto.descargas[0].cartaoDestinatario, //Código do cartão que receberá o crédito em conta.
              cpfDestinatario: createDischargeDto.descargas[0].cpfDestinatario, //CPF do portador do cartão que receberá o crédito em conta.
              valorDescarga: createDischargeDto.descargas[0].valorDescarga, //Valor da descarga a ser realizada.
            },
          ],
        };

        const createDischarge = await axios.post(
          `${process.env.BASE_URL_NIKY}/descarga`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "X-API-Key": `${process.env.NIKY_API_KEY}`,
              idSessao: config.nikySession,
            },
          }
        );
        return createDischarge;
      } else {
        throw new Error("Erro ao autenticar");
      }
    } catch (error) {
      console.error(JSON.stringify(error.response.data, null, 2));
      throw "error ao descarregar cartão na niky";
    }
  }

  async listDischarges() {
    try {
      const config = await this.prismaService.configService.findFirst();
      if (config?.nikySession) {
        const listDischarges = await axios.get(
          `${process.env.BASE_URL_NIKY}/descarga`,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "X-API-Key": `${process.env.NIKY_API_KEY}`,
              idSessao: config.nikySession,
            },
          }
        );
        return listDischarges;
      } else {
        throw new Error("Erro ao autenticar");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async cancelDischarge(dischargeId: string) {
    try {
      const config = await this.prismaService.configService.findFirst();
      if (config?.nikySession) {
        const cancelDischarge = await axios.put(
          `${process.env.BASE_URL_NIKY}/descarga/${dischargeId}/cancelar`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "X-API-Key": `${process.env.NIKY_API_KEY}`,
              idSessao: config.nikySession,
            },
          }
        );
        return cancelDischarge;
      } else {
        throw new Error("Erro ao autenticar");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async listDetailsDischarge(dischargeId: string) {
    try {
      const config = await this.prismaService.configService.findFirst();
      if (config?.nikySession) {
        const listDetailsDischarge = await axios.get(
          `${process.env.BASE_URL_NIKY}/descarga/${dischargeId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "X-API-Key": `${process.env.NIKY_API_KEY}`,
              idSessao: config.nikySession,
            },
          }
        );
        return listDetailsDischarge;
      } else {
        throw new Error("Erro ao autenticar");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async listItemsDischarge() {
    try {
      const config = await this.prismaService.configService.findFirst();
      if (config?.nikySession) {
        const listItemsDischarge = await axios.get(
          `${process.env.BASE_URL_NIKY}/item-descarga`,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "X-API-Key": `${process.env.NIKY_API_KEY}`,
              idSessao: config.nikySession,
            },
          }
        );
        return listItemsDischarge;
      } else {
        throw new Error("Erro ao autenticar");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async createLotOfCards(data: CreateLotOfCardsDto) {
    try {
      const config = await this.prismaService.configService.findFirst();
      if (config?.nikySession) {
        const info: CreateLotOfCardsDto = {
          tipoOperacao: data.tipoOperacao, //Tipo de operação a ser realizada no lote. 1 – Criação de lote de cartões. 2 – Cancelamento de lote de cartões.
          idAgencia: data.idAgencia, //Código identificador da agência de incentivos.
          dataExecucao: data.dataExecucao, //Data de execução do lote. Deve ser preenchido obrigatoriamente quando o tipoLote for 1 (Criação de lote de cartões).
          codigoLoteAgencia: data.codigoLoteAgencia, //Código identificador do lote na agência de incentivos.
          descricaoLoteAgencia: data.descricaoLoteAgencia, //Descrição do lote na agência de incentivos.
          quantidadeTotal: data.quantidadeTotal, //Quantidade total de cartões a serem criados no lote.
          vinculacoes: [
            {
              codigoItemAgencia: data.vinculacoes[0].codigoItemAgencia, //Código identificador do item na agência de incentivos.
              descricaoItemAgencia: data.vinculacoes[0].descricaoItemAgencia, //Descrição do item na agência de incentivos.
              codigoCartao: data.vinculacoes[0].codigoCartao, //Código identificador do cartão.
              cpf: data.vinculacoes[0].cpf, //CPF do beneficiário.
            },
          ],
        };
        const createLotOfCards = await axios.post(
          `${process.env.BASE_URL_NIKY}/vinculacao`,
          { data: info },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "X-API-Key": `${process.env.NIKY_API_KEY}`,
              idSessao: config.nikySession,
            },
          }
        );
        return createLotOfCards;
      } else {
        throw new Error("Erro ao autenticar");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async listLotOfCards() {
    try {
      const config = await this.prismaService.configService.findFirst();
      if (config?.nikySession) {
        const listLotOfCards = await axios.get(
          `${process.env.BASE_URL_NIKY}/item-vinculacao`,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "X-API-Key": `${process.env.NIKY_API_KEY}`,
              idSessao: config.nikySession,
            },
          }
        );
        return listLotOfCards;
      } else {
        throw new Error("Erro ao autenticar");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async cancelLotOfCards(lotOfCardsId: string) {
    try {
      const config = await this.prismaService.configService.findFirst();
      if (config?.nikySession) {
        const cancelLotOfCards = await axios.put(
          `${process.env.BASE_URL_NIKY}/vinculacao/${lotOfCardsId}/cancelar`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "X-API-Key": `${process.env.NIKY_API_KEY}`,
              idSessao: config.nikySession,
            },
          }
        );
        return cancelLotOfCards;
      } else {
        throw new Error("Erro ao autenticar");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async createCard(dataCreateCard: CreateCardNikyDto) {
    try {
      const config = await this.prismaService.configService.findFirst();

      if (config?.nikySession) {
        const { data } = await axios.post(
          `https://stoplight.io/mocks/aqui-pay/aqui-pay-thirdparty-rest-api/51240004/cobrander/cardRequest`,
          dataCreateCard
        );

        return {
          panVas: data.data.content.panVas,
        };
      } else {
        throw new Error("Erro ao autenticar");
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Broker
  async createCardBroker(
    dataCreateCard: CreateCardBrokerDto,
    walletId: string
  ) {
    // console.info(JSON.stringify(dataCreateCard, null, 2));
    try {
      const { data } = await axios.post(
        `${process.env.BASE_URL_NIKY_BROKER}/cobrander/cardRequest`,
        dataCreateCard
      );

      if (data.status === "error") {
        throw new BadRequestException(
          {
            mesage: "Error ao criar cartão niky",
            error: {
              codeError: data.errorCode,
              info: data.info,
            },
          },
          "Error ao criar cartão niky"
        );
      }

      await this.prismaService.userInfo.update({
        where: { walletId: walletId },
        data: { providerError: false },
      });

      return {
        panVas: data.data.content.panVas,
        codeRequest: data.data.content.codeRequest,
      };
    } catch (error) {
      console.error(JSON.stringify(error.response, null, 2));
      console.error(`Payload:`, JSON.stringify(dataCreateCard, null, 2));

      if (error.response) {
        await this.prismaService.userInfo.update({
          where: { walletId: walletId },
          data: { providerError: true },
        });

        throw new BadRequestException(
          error.response,
          "Error ao criar cartão niky"
        );
      }

      throw new BadRequestException(
        {
          mesage: "Error ao criar cartão niky",
          error: "Erro request create card niky",
        },
        "Error ao criar cartão niky"
      );
    }
  }

  // Broker
  async getNumberAndCvvCard(codeRequest: string) {
    try {
      const { nikySession } =
        await this.prismaService.configService.findFirst();

      const dataCvv = await axios.get(
        `${process.env.BASE_URL_NIKY_BROKER}/cobrander/getCardCvv?tokenCode=${nikySession}&codeRequest=${codeRequest}`
      );

      const dataNumber = await axios.get(
        `${process.env.BASE_URL_NIKY_BROKER}/cobrander/getCardNumber?tokenCode=${nikySession}&codeRequest=${codeRequest}`
      );

      if (
        dataCvv.data.status === "error" ||
        dataNumber.data.status === "error"
      ) {
        throw new BadRequestException(
          {
            mesage: "Error ao obter dado do cartão",
            error: {
              codeError: dataNumber.data.errorCode ?? dataCvv.data.errorCode,
              info: dataNumber.data.info ?? dataCvv.data.info,
            },
          },
          "Error ao obter dado do cartão"
        );
      }

      return {
        pan: dataNumber.data.data.content.pan,
        cvv: dataCvv.data.data.content.cvv,
        expireDate: dataNumber.data.data.content.expireDate,
        name: dataNumber.data.data.content.name,
      };
    } catch (error) {
      console.error(JSON.stringify(error.response, null, 2));

      if (error.response) {
        throw new BadRequestException(
          error.response,
          "Error ao obter dado do cartão"
        );
      }

      throw new BadRequestException(
        {
          mesage: "Error ao obter dado do cartão",
          error: "Error get info card",
        },
        "Error ao obter dado do cartão"
      );
    }
  }

  // activate card Broker
  async activateCardBroker(codeRequest: string) {
    try {
      const { nikySession } =
        await this.prismaService.configService.findFirst();

      const { data } = await axios.post(
        `${process.env.BASE_URL_NIKY_BROKER}/cobrander/cardActivation`,
        {
          tokenCode: nikySession,
          codeRequest: codeRequest,
        }
      );

      if (data.status === "error") {
        throw new BadRequestException(
          {
            mesage: "Error ao ativar cartão niky",
            error: {
              codeError: data.errorCode,
              info: data.info,
            },
          },
          "Error ao ativar cartão niky"
        );
      }

      return { message: data.data.content };
    } catch (error) {
      console.error(JSON.stringify(error.response, null, 2));

      if (error.response) {
        throw new BadRequestException(
          error.response,
          "Error ao ativar cartão niky"
        );
      }

      throw new BadRequestException(
        {
          mesage: "Error ao ativar cartão niky",
          error: "Erro request create card niky",
        },
        "Error ao ativar cartão niky"
      );
    }
  }

  // Block card Broker
  async blockCard(codeRequest: string, blockEvent = "03") {
    try {
      const { nikySession } =
        await this.prismaService.configService.findFirst();

      const { data } = await axios.post(
        `${process.env.BASE_URL_NIKY_BROKER}/cobrander/blockCard`,
        {
          tokenCode: nikySession,
          codeRequest: codeRequest,
          blockEvent: blockEvent,
        }
      );

      if (data.data.status === "error") {
        throw new BadRequestException(
          {
            mesage: "Error ao bloquear cartão",
            error: {
              codeError: data.data.errorCode,
              info: data.data.info,
            },
          },
          "Error ao bloquear cartão"
        );
      }

      return data.data;
    } catch (error) {
      console.error(JSON.stringify(error.response, null, 2));

      if (error.response) {
        throw new BadRequestException(
          error.response,
          "Error ao bloquear cartão"
        );
      }

      throw new BadRequestException(
        {
          mesage: "Error ao bloquear cartão",
          error: "Error get info card",
        },
        "Error ao bloquear cartão"
      );
    }
  }

  // Desbloquear card Broker
  async unlockCard(codeRequest: string) {
    try {
      const { nikySession } =
        await this.prismaService.configService.findFirst();

      const { data } = await axios.post(
        `${process.env.BASE_URL_NIKY_BROKER}/cobrander/unlockCard`,
        {
          tokenCode: nikySession,
          codeRequest: codeRequest,
        }
      );

      if (data.data.status === "error") {
        throw new BadRequestException(
          {
            mesage: "Error ao desbloquear cartão",
            error: {
              codeError: data.data.errorCode,
              info: data.data.info,
            },
          },
          "Error ao desbloquear cartão"
        );
      }

      return data.data;
    } catch (error) {
      console.error(JSON.stringify(error.response, null, 2));

      if (error.response) {
        throw new BadRequestException(
          error.response,
          "Error ao desbloquear cartão"
        );
      }

      throw new BadRequestException(
        {
          mesage: "Error ao desbloquear cartão",
          error: "Error get info card",
        },
        "Error ao desbloquear cartão"
      );
    }
  }

  async unlinkCard(data: UnlinkCardsDto) {
    try {
      const config = await this.prismaService.configService.findFirst();
      if (config?.nikySession) {
        const info: UnlinkCardsDto = {
          tipoOperacao: data.tipoOperacao, //Tipo de operação a ser realizada no lote. 1 – Criação de lote de cartões. 2 – Cancelamento de lote de cartões.
          idAgencia: data.idAgencia, //Código identificador da agência de incentivos.
          dataExecucao: data.dataExecucao, //Data de execução do lote. Deve ser preenchido obrigatoriamente quando o tipoLote for 1 (Criação de lote de cartões).
          codigoLoteAgencia: data.codigoLoteAgencia, //Código identificador do lote na agência de incentivos.
          descricaoLoteAgencia: data.descricaoLoteAgencia, //Descrição do lote na agência de incentivos.
          quantidadeTotal: data.quantidadeTotal, //Quantidade total de cartões a serem criados no lote.
          desvinculacoes: [
            {
              codigoItemAgencia: data.desvinculacoes[0].codigoItemAgencia, //Código identificador do item na agência de incentivos.
              descricaoItemAgencia: data.desvinculacoes[0].descricaoItemAgencia, //Descrição do item na agência de incentivos.
              codigoCartao: data.desvinculacoes[0].codigoCartao, //Código identificador do cartão.
              cpf: data.desvinculacoes[0].cpf, //CPF do beneficiário.
            },
          ],
        };
        const unlinkCard = await axios.post(
          `${process.env.BASE_URL_NIKY}/desvinculacao`,
          { data: info },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "X-API-Key": `${process.env.NIKY_API_KEY}`,
              idSessao: config.nikySession,
            },
          }
        );
        return unlinkCard;
      } else {
        throw new Error("Erro ao autenticar");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async listUnlinkCard() {
    try {
      const config = await this.prismaService.configService.findFirst();
      if (config?.nikySession) {
        const listUnlinkCard = await axios.get(
          `${process.env.BASE_URL_NIKY}/item-desvinculacao`,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "X-API-Key": `${process.env.NIKY_API_KEY}`,
              idSessao: config.nikySession,
            },
          }
        );
        return listUnlinkCard;
      } else {
        throw new Error("Erro ao autenticar");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async cancelUnlinkCard(unlinkCardId: string) {
    try {
      const config = await this.prismaService.configService.findFirst();
      if (config?.nikySession) {
        const cancelUnlinkCard = await axios.put(
          `${process.env.BASE_URL_NIKY}/desvinculacao/${unlinkCardId}/cancelar`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "X-API-Key": `${process.env.NIKY_API_KEY}`,
              idSessao: config.nikySession,
            },
          }
        );
        return cancelUnlinkCard;
      } else {
        throw new Error("Erro ao autenticar");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async updateBearerData(cardId: string, data: UpdateBearerDataDto) {
    try {
      const config = await this.prismaService.configService.findFirst();
      if (config?.nikySession) {
        const info: UpdateBearerDataDto = {
          codigoAreaCelular: data.codigoAreaCelular,
          numeroCelular: data.numeroCelular,
          email: data.email,
          logradouro: data.logradouro,
          numeroLogradouro: data.numeroLogradouro,
          complementoLogradouro: data.complementoLogradouro,
          bairro: data.bairro,
          cidade: data.cidade,
          codigoCidadeIbge: data.codigoCidadeIbge,
          estado: data.estado,
          cep: data.cep,
        };
        const updateBearerData = await axios.put(
          `${process.env.BASE_URL_NIKY}/cartao/${cardId}/portador`,
          { data: info },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "X-API-Key": `${process.env.NIKY_API_KEY}`,
              idSessao: config.nikySession,
            },
          }
        );
        return updateBearerData;
      } else {
        throw new Error("Erro ao autenticar");
      }
    } catch (error) {
      console.log(error);
    }
  }

  // async unlockCard(cardId: string) {
  //   try {
  //     const config = await this.prismaService.configService.findFirst();
  //     if (config?.nikySession) {
  //       const unlockCard = await axios.put(
  //         `${process.env.BASE_URL_NIKY}/cartao/${cardId}/desbloquear`,
  //         {},
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //             Accept: "application/json",
  //             "X-API-Key": `${process.env.NIKY_API_KEY}`,
  //             idSessao: config.nikySession,
  //           },
  //         }
  //       );
  //       return unlockCard;
  //     } else {
  //       throw new Error("Erro ao autenticar");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // async blockCard(cardId: string, data: BlockCardDto) {
  //   try {
  //     const config = await this.prismaService.configService.findFirst();
  //     if (config?.nikySession) {
  //       const info = {
  //         motivoBloqueio: data.motivoBloqueio,
  //       };
  //       const blockCard = await axios.put(
  //         `${process.env.BASE_URL_NIKY}/cartao/${cardId}/bloquear`,
  //         { data: info },
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //             Accept: "application/json",
  //             "X-API-Key": `${process.env.NIKY_API_KEY}`,
  //             idSessao: config.nikySession,
  //           },
  //         }
  //       );
  //       return blockCard;
  //     } else {
  //       throw new Error("Erro ao autenticar");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  async listCardInformation(cpfPortador: string) {
    try {
      const config = await this.prismaService.configService.findFirst();

      if (config?.nikySession) {
        const { data } = await axios.get(
          `${process.env.BASE_URL_NIKY}/cartao?cpfPortador=${cpfPortador}`,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "x-api-key": `${process.env.NIKY_API_KEY}`,
              idSessao: config.nikySession,
            },
          }
        );
        return data;
      } else {
        throw new Error("Erro ao autenticar");
      }
    } catch (error) {
      throw new BadRequestException(
        {
          mesage: "Error ao listar as movimentações cartão niky",
          error: "Erro request list movements card niky",
        },
        "Error ao listar as movimentações cartão niky"
      );
    }
  }

  async CardInformation(cpfPortador: string, providerId: string) {
    try {
      const config = await this.prismaService.configService.findFirst();

      if (config?.nikySession) {
        const { data } = await axios.get(
          `${process.env.BASE_URL_NIKY}/cartao?cpfPortador=${cpfPortador}&codigoCartao=${providerId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "x-api-key": `${process.env.NIKY_API_KEY}`,
              idSessao: config.nikySession,
            },
          }
        );

        if (!data.cartao[0]) return undefined;

        return data.cartao[0];
      } else {
        throw new Error("Erro ao autenticar");
      }
    } catch (error) {
      throw new BadRequestException(
        {
          mesage: "Error ao listar as movimentações cartão niky",
          error: "Erro request list movements card niky",
        },
        "Error ao listar as movimentações cartão niky"
      );
    }
  }

  async consultMovementsCard(cardId: string) {
    try {
      const config = await this.prismaService.configService.findFirst();
      if (config?.nikySession) {
        const { data } = await axios.get(
          `${process.env.BASE_URL_NIKY}/cartao/${cardId}/extrato`,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "X-API-Key": `${process.env.NIKY_API_KEY}`,
              idSessao: config.nikySession,
            },
          }
        );

        console.log(data);
        return data;
      } else {
        throw new Error("Erro ao autenticar");
      }
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async updateChargeStatus(data: UpdateChargeStatusDto) {
    try {
      const config = await this.prismaService.configService.findFirst();
      if (config?.nikySession) {
        const info: UpdateChargeStatusDto = {
          idItemRecarga: data.idItemRecarga,
          codigoItemAgencia: data.codigoItemAgencia,
          dataStatusItem: data.dataStatusItem,
          status: data.status,
        };
        const updateChargeStatus = await axios.put(
          `${process.env.BASE_URL_NIKY}/recarga-status`,
          { data: info },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "X-API-Key": `${process.env.NIKY_API_KEY}`,
              idSessao: config.nikySession,
            },
          }
        );
        return updateChargeStatus;
      } else {
        throw new Error("Erro ao autenticar");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async updateDischargeStatus(data: UpdateDischargeStatusDto) {
    try {
      const config = await this.prismaService.configService.findFirst();
      if (config?.nikySession) {
        const info: UpdateDischargeStatusDto = {
          idItemDescarga: data.idItemDescarga,
          codigoItemAgencia: data.codigoItemAgencia,
          dataStatusItem: data.dataStatusItem,
          status: data.status,
        };
        const updateDischargeStatus = await axios.put(
          `${process.env.BASE_URL_NIKY}/descarga-status`,
          { data: info },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "X-API-Key": `${process.env.NIKY_API_KEY}`,
              idSessao: config.nikySession,
            },
          }
        );
        return updateDischargeStatus;
      } else {
        throw new Error("Erro ao autenticar");
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * função que converte os dados, para a criação de cartão da niky na api broker
   * @param input:
   */
  convertPayloadCreateCreditCardBroker(
    user: {
      email: string;
      documentCNPJ?: string;
      aproved: boolean;
      address: {
        zipcode: string;
        street: string;
        number: string;
        state: string;
        neighborhood: string;
        city: string;
        complement?: string;
        country?: string;
      };
    },
    input: CreateCreditCardDto,
    token: string
  ): CreateCardBrokerDto {
    const requestRelation = {
      codeCobrander: "H360B",
      codeProduct: "H360BN001",
      codeCardCategory: "H360BN001",
      virtual: input.card.virtual,
    };

    if (user.documentCNPJ && user.documentCNPJ.length > 0 && user.aproved) {
      requestRelation["fourthLine"] = user.documentCNPJ;
    }

    return {
      tokenCode: token,
      content: {
        requestRelation: requestRelation,
        applicant: {
          newCustomer: true,
          customerDetailBean: {
            name: input.name,
            surname: input.surname,
            nameMother: input.nameMother,
            flagSex: input.gender,
            taxCode: input.cpf,
            flagNationality: "1",
            email: user.email,
            mobile: input.cellPhone,
            dateBirth: `${input.birthDate}T00:00:00.000Z`,
            nationBirth: {
              nameNation: "Brasil",
            },
            foreignBirthLocation: input.stateBirth,
            streetNumber: user.address.number,
            address: user.address.street,
            cap: user.address.zipcode,
            district: user.address.neighborhood,
            complemento: user.address.complement,
            municipalityResidence: {
              progProvinciaId: user.address.state,
              nameComune: user.address.city,
              nameProvincia: user.address.state,
            },
            nationResidence: {
              nameNation: "Brasil",
            },
          },
          customerDocumentBean: {
            codeDocument: removeMaskRG(input.rg),
            documentType: {
              code: "RGE",
            },
          },
          adeguataVerificaPersonaFisica: {
            politicamenteEsposta: "false",
            fasciaReddito: "4500",
          },
          roleType: "TITOLARE_RAPPORTO",
          flagOmocodia: false,
        },
        emailContact: user.email,
        mobilePhoneContact: input.cellPhone,
        dateRequest: new Date(),
        tradePurpose: "true",
        isGenerateBoleto: "false",
        isSendNotify: "false",
        cardIssuing: input.card.virtual,
      },
    };
  }
}
