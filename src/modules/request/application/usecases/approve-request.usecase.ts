import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateRevenueAntecipationUsecase } from "../../../../modules/revenue-antecipation/application/use-cases/create-revenue-antecipation.usecase";
import { ApprovedRequestDTO } from "../../dto/approved-request.dto";
import { RequestService } from "../../request.service";
import { WalletService } from "src/modules/wallet/wallet.service";
@Injectable()
class ApproveRequestUseCase {
  constructor(
    private requestService: RequestService,
    private createRevenueAntecipationUsecase: CreateRevenueAntecipationUsecase,
    private walletService: WalletService,
  ) {}
  async execute(input: ApprovedRequestDTO) {
    console.log("start approve request", input);
    //To approve the request using the id of the request
    const requestAproved = await this.requestService.updateAntecipationRequest(
      input.requestId,
      {
        status: !!input.automatic ? "autoAproved" : "aproved",
      },
    );
    //Verify if the request was approved
    if (!requestAproved) {
      return "Request not found";
    }
    console.log("start create revenue antecipation");
    const wallet = await this.walletService.findWalletUser(
      requestAproved.userId,
    );
    try {
      const response = await this.createRevenueAntecipationUsecase.execute({
        walletId: wallet.id,
        request: requestAproved,
        provider: input.provider,
      });
      console.log("ApproveRequestUseCase response ", response);
      return response;
    } catch (error) {
      console.log("ApproveRequestUseCase error ", error);
      await this.requestService.updateAntecipationRequest(input.requestId, {
        status: "waiting",
      });
      if (error?.response?.data) {
        throw new BadRequestException(error.response.data);
      }
      throw error;
    }
  }
}
export { ApproveRequestUseCase };
