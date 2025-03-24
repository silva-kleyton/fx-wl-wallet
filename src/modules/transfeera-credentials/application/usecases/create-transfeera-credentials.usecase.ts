import { Injectable } from "@nestjs/common";
import { CrytoService } from "../../../../utils/crypto/crypto.service";
import { TransfeeraCredentialsDTO } from "../../adapter/dto/create-transfeera-credentials.dto";
import { TransfeeraCredentialsService } from "../services/transfeera-credentials.service";
@Injectable()
class CreateTransfeeraCredentialsUsecase {
  constructor(
    private transfeeraCredentialsService: TransfeeraCredentialsService,
    private crytoService: CrytoService,
  ) {}
  async execute(input: TransfeeraCredentialsDTO) {
    const { adminId, clientId, clientSecret } = input;
    //Verify if the adminId already has a credential
    let credentialExists =
      await this.transfeeraCredentialsService.findCredentialByAdminId({
        adminId,
      });
    if (credentialExists) {
      return { error: "Admin already has a credential" };
    }
    const encryptedPassword = this.crytoService.encrypt(clientSecret);
    //Create a new credential
    await this.transfeeraCredentialsService.create({
      adminId,
      clientId,
      clientSecret: encryptedPassword,
    });
    //Verify if the credential was created
    credentialExists =
      await this.transfeeraCredentialsService.findCredentialByAdminId({
        adminId,
      });
    if (credentialExists) {
      return { data: "Admin credentials has been created" };
    }
  }
}
export { CreateTransfeeraCredentialsUsecase };
