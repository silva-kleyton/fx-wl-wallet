import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { VolutiCredentialsDTO } from "../../adapter/dto/upsert-voluti-credentials.dto";
import { GetVolutiCredentialsDto } from "../../adapter/dto/get-voluti-credentials.dto";

@Injectable()
class VolutiCredentialsService {
  constructor(private prismaService: PrismaService) {}
  async upsert(input: VolutiCredentialsDTO) {
    const { adminId, ...credentials } = input;
    const alreadyExists = await this.prismaService.volutiCredentials.findFirst({
      where: {
        adminId,
      },
    });
    let result;
    if (alreadyExists) {
      result = await this.prismaService.volutiCredentials.update({
        data: {
          ...credentials,
          adminId,
        },
        where: {
          id: alreadyExists.id,
        },
      });
    } else {
      result = await this.prismaService.volutiCredentials.create({
        data: {
          ...credentials,
          adminId,
        },
      });
    }
    return result;
  }
  async findCredentialByAdminId(input: GetVolutiCredentialsDto) {
    const { adminId } = input;
    return await this.prismaService.volutiCredentials.findFirst({
      where: {
        adminId,
      },
    });
  }
}

export { VolutiCredentialsService };
