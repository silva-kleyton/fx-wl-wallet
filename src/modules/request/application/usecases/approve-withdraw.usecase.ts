import { BadRequestException, Injectable } from "@nestjs/common";
import { RequestService } from "../../request.service";
@Injectable()
class ApproveWithdrawUseCase {
  constructor(private requestService: RequestService) {}
  async execute(input: string) {
    //To update the status of a withdraw request to approved
    const updatedWithdraw = await this.requestService.updateAntecipationRequest(
      input,
      {
        status: "aproved",
      },
    );
    //To verify if the withdraw request was updated
    if (!updatedWithdraw) {
      throw new BadRequestException("Withdraw request not found");
    }
    return updatedWithdraw;
  }
}
export { ApproveWithdrawUseCase };
