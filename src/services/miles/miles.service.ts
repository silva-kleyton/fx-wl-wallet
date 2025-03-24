import {
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import axios from "axios";
import { addDays, subHours } from "date-fns";
import { PrismaService } from "../../prisma/prisma.service";
import { CoreService } from "../core/core.service";
import { OptionalParamsFindMileDto } from "./dto/optional-params-find-mile.dto";
import { PercentageMileDto } from "./dto/percentage-mile.dto";
import { PointsDto } from "./dto/points.dto";
import { QuotationMileDto } from "./dto/quotation-mile.dto";

@Injectable()
export class MilesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly coreService: CoreService
  ) {}

  /**
   * @name milesAuth
   * @description Método para autenticar na API 123 Milhas
   * @returns Retorna a cotação atual das milhas
   */
  async milesAuth() {
    try {
      const BASE_URL = process.env.MILES_URL;
      const endpoint = "/b2b/login";
      const headers = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };
      const data = {
        client_id: process.env.MILES_USER,
        client_secret: process.env.MILES_PASSWORD,
        channel: "V", //A documentação da 123 Milhas orienta que o valor 'V' deve ser enviado de forma fixa.
      };
      const responseMiles = await axios.post(
        `${BASE_URL}${endpoint}`,
        data,
        headers
      );
      return responseMiles.data;
    } catch (error) {
      throw new UnauthorizedException("Erro ao autenticar na api  123 Milhas!");
    }
  }

  /**
   * @name convertPoints
   * @description Método para converter pontos em milhas
   * @param {PointsDto} pointsDto: DTO com os dados para conversão
   * @param {string} user_email: Email do usuário
   * @returns Retorna a cotação atual das milhas
   */
  async pointsConversion(pointsDto: PointsDto) {
    //Chamada para a CORE para pegar o CPF do usuario
    const getUser = await this.coreService.getUserByEmail(pointsDto.userEmail);
    const CPF = getUser.cpf;
    const { quotation } = await this.prisma.milesConfig.findFirst();

    if (!quotation) {
      throw new Error("Cotação não encontrada!");
    }

    const points = pointsDto.value / Number(quotation);

    //Insere os pontos na tabela UserMiles
    if (points >= 1000) {
      return await this.prisma.userMiles.create({
        data: {
          user: getUser.id,
          pointsToRedeem: Math.floor(points), //Arredonda para baixo
        },
      });
    } else {
      return await this.prisma.userMiles.create({
        data: {
          user: getUser.id,
          pointsAccumulated: Math.floor(points), //Arredonda para baixo
        },
      });
    }
  }

  async sendToMilesApi(pointsDto: PointsDto) {
    if (pointsDto.value < 1000) {
      throw new ForbiddenException(
        "Não é possível transferir menos de 1000 pontos!"
      );
    }
    //Chamada para a CORE para pegar o CPF do usuario
    const getUser = await this.coreService.getUserByEmail(pointsDto.userEmail);
    const CPF = getUser.cpf;

    //Chamada e autenticação para a API 123Milhas
    const auth = await this.milesAuth();

    if (auth?.access_token) {
      const endpoint = `/b2b/trnprocessor/identifiers/no=${CPF}/sales`;
      const headers = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.access_token}`,
        },
      };
      const code = Math.floor(Math.random() * 65536);
      const data = {
        comment: "Transferência de pontos",
        date: new Date().toISOString(),
        partner: process.env.MILES_PARTNER_CODE,
        trnNo: `${process.env.MILES_PARTNER_CODE}_${code}`,
        inputPoints: pointsDto.value,
      };
      const accumulation = await axios.post(
        `${process.env.MILES_URL}${endpoint}`,
        data,
        headers
      );

      //Desativa os pontos do usuário
      await this.prisma.userMiles.updateMany({
        where: {
          user: getUser.id,
          status: "active",
        },
        data: {
          status: "inactive",
        },
      });
      return accumulation?.data;
    } else {
      throw new Error("Erro ao autenticar na api  123Milhas!");
    }
  }

  /**
   * @name getPoints
   * @param userId  UUID do usuário
   * @returns Retorna os pontos acumulados e os pontos para resgate
   */
  async getPoints(userId: string) {
    const getUserMiles = await this.prisma.userMiles.findMany({
      where: {
        user: userId,
        AND: {
          status: "active",
        },
      },
    });

    const pointsAccumulated = getUserMiles.reduce((acc, item) => {
      return acc + item.pointsAccumulated;
    }, 0);

    const pointsToReDeem = getUserMiles[0]?.pointsToRedeem || 0;

    const dataUserMiles = {
      pointsAccumulated,
      pointsToReDeem,
    };
    return dataUserMiles;
  }

  /**
   * @name quotation
   * @param quotationMileDto
   * @returns Retorna a cotação atual das milhas criada
   */
  async quotation(quotationMileDto: QuotationMileDto) {
    const valor = quotationMileDto.value;
    return await this.prisma.milesConfig.create({
      data: {
        quotation: valor,
      },
    });
  }

  /**
   * @name percentage
   * @param percentageMileDto
   * @returns Retorna a porcentagem da milha criada
   */
  async percentage(percentageMileDto: PercentageMileDto) {
    const valor = percentageMileDto.value;
    return await this.prisma.milesConfig.create({
      data: {
        percentage: valor,
      },
    });
  }

  async groupBy(array, key) {
    return array.reduce(
      (acc, item) => ({
        ...acc,
        [item[key]]: [...(acc[item[key]] ?? []), item],
      }),
      {}
    );
  }

  async checkPointsToReDeem() {
    const points = await this.prisma.userMiles.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });

    const users = await this.groupBy(points, "user");
    for (const key in users) {
      console.log(key);
      if (Object.prototype.hasOwnProperty.call(users, key)) {
        const element = users[key];
        console.log(element);
        const pointsAccumulated = element.reduce((acc, item) => {
          return acc + item.pointsAccumulated;
        }, 0);
        if (pointsAccumulated >= 1000) {
          await this.prisma.userMiles.updateMany({
            where: {
              user: key,
              AND: {
                status: "active",
              },
            },
            data: {
              pointsToRedeem: pointsAccumulated,
            },
          });
        }
      }
    }
  }

  async getPointsHistory(optionalParams?: OptionalParamsFindMileDto) {
    const userId = optionalParams.userId;
    const startDate = optionalParams.startAt
      ? subHours(optionalParams.startAt, 3)
      : undefined;
    const endDate = optionalParams.endAt
      ? subHours(addDays(optionalParams.endAt, 1), 3)
      : undefined;
    const status = optionalParams.status;

    let query = {
      user: userId,
      deletedAt: null,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      status: status,
    };

    const getUserMiles = await this.prisma.userMiles.findMany({
      where: query,
    });

    return getUserMiles;
  }
}
