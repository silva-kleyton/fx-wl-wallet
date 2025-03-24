import { Injectable } from "@nestjs/common";
import { CrytoService } from "../../../../utils/crypto/crypto.service";

import { VolutiCredentialsDTO } from "../../adapter/dto/upsert-voluti-credentials.dto";
import { VolutiCredentialsService } from "../services/voluti-credentials.service";
import { VolutiService } from "src/modules/withdraw/application/services/voluti.service";
@Injectable()
class UpsertVolutiCredentialsUseCase {
  constructor(
    private volutiCredentialsService: VolutiCredentialsService,
    private crytoService: CrytoService,
    private volutiService: VolutiService,
  ) {}
  async execute(input: VolutiCredentialsDTO) {
    const {
      adminId,
      clientId,
      clientSecret,
      certificateCrt,
      certificateKey,
      certificatePfx,
      pfxPassword,
    } = input;
    try {
      await this.volutiService.createTransferWebhook({
        clientId,
        clientSecret,
        certificateCrt,
        certificateKey,
        certificatePfx,
        pfxPassword,
      });
    } catch (error) {
      return { error: "Error creating webhook" };
    }

    const result = await this.volutiCredentialsService.upsert({
      adminId,
      clientId: this.crytoService.encrypt(clientId),
      clientSecret: this.crytoService.encrypt(clientSecret),
      certificateCrt: this.crytoService.encrypt(certificateCrt),
      certificateKey: this.crytoService.encrypt(certificateKey),
      certificatePfx: this.crytoService.encrypt(certificatePfx),
      pfxPassword: this.crytoService.encrypt(pfxPassword),
    });

    return { data: result };
  }
}
export { UpsertVolutiCredentialsUseCase };
