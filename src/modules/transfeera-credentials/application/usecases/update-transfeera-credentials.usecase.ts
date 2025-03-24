import { Injectable } from "@nestjs/common";
import { CrytoService } from "../../../../utils/crypto/crypto.service";
import { UpdateTransfeeraCredentialsDto } from "../../adapter/dto/update-transfeera-credentials.dto";
import { TransfeeraCredentialsService } from "../services/transfeera-credentials.service";
@Injectable()
class UpdateTransfeeraCredentialsUseCase {
  constructor(
    private transfeeraCredentialsService: TransfeeraCredentialsService,
    private crytoService: CrytoService,
  ) {}
  async execute(input: UpdateTransfeeraCredentialsDto) {
    const { clientSecret, clientId, adminId } = input;
    const encryptedClientSecret = this.crytoService.encrypt(clientSecret);
    const result = await this.transfeeraCredentialsService.update({
      clientId,
      clientSecret,
      encryptedClientSecret,
      adminId,
    });
    if (result == "Admin not found") {
      return { error: "Admin not found" };
    }
    return result;
  }
}
export { UpdateTransfeeraCredentialsUseCase };
