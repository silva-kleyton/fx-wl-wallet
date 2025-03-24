import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../prisma/prisma.service";
import { TransfeeraCredentialsDTO } from "../../adapter/dto/create-transfeera-credentials.dto";
import { DeleteTransfeeraCredentialsDto } from "../../adapter/dto/delete-transfeera-credentials.dto";
import { RetrieveTransfeeraCredentialsDto } from "../../adapter/dto/retrieve-transfeera-credentials.dto";
import { UpdateTransfeeraCredentialsDto } from "../../adapter/dto/update-transfeera-credentials.dto";
@Injectable()
class TransfeeraCredentialsService {
  constructor(private prismaService: PrismaService) {}
  async create(input: TransfeeraCredentialsDTO) {
    const { adminId, clientId, clientSecret } = input;
    return await this.prismaService.transfeeraCredentials.create({
      data: {
        adminId,
        clientId,
        clientSecret,
      },
    });
  }
  async findCredentialByAdminId(input: RetrieveTransfeeraCredentialsDto) {
    const { adminId } = input;
    return await this.prismaService.transfeeraCredentials.findFirst({
      where: {
        adminId,
      },
    });
  }
  async update(input: UpdateTransfeeraCredentialsDto) {
    const { clientId, clientSecret, adminId, encryptedClientSecret } = input;
    //To check if the adminId exists in the database
    const adminExists =
      await this.prismaService.transfeeraCredentials.findFirst({
        where: {
          adminId,
        },
      });
    if (!adminExists) {
      return "Admin not found";
    }

    if (clientSecret === adminExists.clientSecret) {
      return adminExists;
    }
    //To update the credentials
    return await this.prismaService.transfeeraCredentials.update({
      where: {
        adminId: adminId,
      },
      data: {
        clientId,
        clientSecret: encryptedClientSecret,
      },
    });
  }
  async delete(input: DeleteTransfeeraCredentialsDto) {
    const { adminId } = input;
    try {
      return await this.prismaService.transfeeraCredentials.delete({
        where: {
          adminId,
        },
      });
    } catch (error) {
      return null;
    }
  }
}
export { TransfeeraCredentialsService };
