import { Injectable } from "@nestjs/common";
import { DeleteTransfeeraCredentialsDto } from "../../adapter/dto/delete-transfeera-credentials.dto";
import { TransfeeraCredentialsService } from "../services/transfeera-credentials.service";
@Injectable()
class DeleteTransfeeraCredentialsUseCase {
  constructor(
    private transfeeraCredentialsService: TransfeeraCredentialsService,
  ) {}
  async execute(input: DeleteTransfeeraCredentialsDto) {
    const deletedCredential =
      await this.transfeeraCredentialsService.delete(input);
    if (!deletedCredential) {
      return { error: "It was not possible to delete the credentials" };
    }
    return { data: "Credentials deleted successfully" };
  }
}
export { DeleteTransfeeraCredentialsUseCase };
