import { Injectable } from "@nestjs/common";
import { RetrieveTransfeeraCredentialsDto } from "../../adapter/dto/retrieve-transfeera-credentials.dto";
import { TransfeeraCredentialsService } from "../services/transfeera-credentials.service";
@Injectable()
class ListTransfeeraCredentialsUseCase {
  constructor(
    private transfeeraCredentialsService: TransfeeraCredentialsService,
  ) {}
  async execute(input: RetrieveTransfeeraCredentialsDto) {
    return await this.transfeeraCredentialsService.findCredentialByAdminId({
      adminId: input.adminId,
    });
  }
}
export { ListTransfeeraCredentialsUseCase };
