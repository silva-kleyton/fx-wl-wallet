import { Injectable } from "@nestjs/common";

import { GetVolutiCredentialsDto } from "../../adapter/dto/get-voluti-credentials.dto";
import { VolutiCredentialsService } from "../services/voluti-credentials.service";
@Injectable()
class ListVolutiCredentialsUseCase {
  constructor(private volutiCredentialsService: VolutiCredentialsService) {}
  async execute(input: GetVolutiCredentialsDto) {
    return await this.volutiCredentialsService.findCredentialByAdminId({
      adminId: input.adminId,
    });
  }
}
export { ListVolutiCredentialsUseCase };
