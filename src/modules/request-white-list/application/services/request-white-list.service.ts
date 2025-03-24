import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../prisma/prisma.service";
import { CreateRequestWhiteListDTO } from "../../adapters/dto/create-request-white-list.dto";
import { EnableOrDisableRequestWhiteListDTO } from "../../adapters/dto/enable-or-disable-white-list.dto";
@Injectable()
class RequestWhiteListService {
  constructor(private prismaService: PrismaService) {}

  async createRequestWhiteList(input: CreateRequestWhiteListDTO) {
    const requestWhiteList = await this.prismaService.requestWhiteList.create({
      data: {
        walletId: input.walletId,
        typeRequest: input.typeRequest,
        isActive: input.isActive,
        adminId: input.adminId,
      },
    });
    return requestWhiteList;
  }

  async findRequestWhiteListDuplicated(input: CreateRequestWhiteListDTO) {
    return await this.prismaService.requestWhiteList.findFirst({
      where: {
        walletId: input.walletId,
        typeRequest: input.typeRequest,
        isActive: input.isActive,
      },
    });
  }

  async listAllRequestWhiteListByAdmin(input: string) {
    return await this.prismaService.requestWhiteList.findMany({
      where: {
        adminId: input,
      },
    });
  }

  async listRequestWhiteListById(input: string) {
    return await this.prismaService.requestWhiteList.findFirst({
      where: {
        id: input,
      },
    });
  }
  async enableOrDisableRequestWhiteList(
    input: EnableOrDisableRequestWhiteListDTO,
  ) {
    const requestWhiteList =
      await this.prismaService.requestWhiteList.findFirst({
        where: {
          id: input.id,
        },
      });
    return await this.prismaService.requestWhiteList.update({
      where: {
        id: input.id,
      },
      data: {
        isActive: requestWhiteList.isActive ? false : true,
      },
    });
  }
}
export { RequestWhiteListService };
