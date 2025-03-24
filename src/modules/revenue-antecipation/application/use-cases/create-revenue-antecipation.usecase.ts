import { BadRequestException, Injectable } from "@nestjs/common";
import axios from "axios";
import { RequestWhiteListService } from "../../../../modules/request-white-list/application/services/request-white-list.service";
import { RequestService } from "../../../../modules/request/request.service";
import { TransactionService } from "../../../../modules/transaction/transaction.service";
import { WalletService } from "../../../../modules/wallet/wallet.service";
import { CreateRevenueAntecipationDto } from "../../adapters/dto/create-revenue-antecipation.dto";
import { EnumRequestStatusAntecipation } from "@prisma/client";
import { CreateAntecipationTransactionsUseCase } from "./create-antecipation-transactions.usecase";

@Injectable()
class CreateRevenueAntecipationUsecase {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly walletService: WalletService,
    private readonly requestService: RequestService,
    private readonly requestWhiteListService: RequestWhiteListService,
    private readonly createAntecipationTransactionsUseCase: CreateAntecipationTransactionsUseCase,
  ) {}

  async execute(input: CreateRevenueAntecipationDto) {
    console.log("CreateRevenueAntecipationUsecase", input);
    //Get the transactions from the next month
    const transactions =
      await this.transactionService.getTransactionStartTomorrow(
        input.walletId,
        input.request.lastTransactionDate,
      );

    //Get the seller wallet id
    const sellerWalletId = input.walletId;
    // Get the seller wallet
    const sellerWallet = await this.walletService.findOne(sellerWalletId);
    if (!sellerWallet || !sellerWallet.adminId) {
      throw new BadRequestException("Error to get the seller wallet");
    }

    if (input.provider !== "iugu") {
      if (transactions.length === 0) {
        throw new BadRequestException("No transactions to antecipate");
      }
      //Verify if the seller is in the white list
      const sellerInWhiteList =
        await this.requestWhiteListService.findRequestWhiteListDuplicated({
          walletId: sellerWalletId,
          typeRequest: "antecipation",
          isActive: true,
          adminId: sellerWallet.adminId,
        });
      if (!sellerInWhiteList) {
        // Verify if the seller  requested a revenue antecipation with status waiting
        const requestForAntecipation =
          await this.requestService.getAntecipationRequestsByUserId(
            sellerWallet.user,
          );
        if (requestForAntecipation) {
          throw new BadRequestException(
            "The seller already requested a revenue antecipation",
          );
        }
        //Verify if the admin aproved the seller antecipation request
        const requestAproved =
          await this.requestService.getAprovedAntecipationRequestsByUserId(
            sellerWallet.user,
          );
        if (!requestAproved) {
          throw new BadRequestException(
            "The seller antecipation was not requested or aproved",
          );
        }
      }
    }

    let approveAnticipationResponse: {
      status: EnumRequestStatusAntecipation;
      success: true;
    };
    try {
      console.log("sale anticipation approve ", sellerWallet.user);
      const response = await axios.post(
        `${process.env.BASE_URL_SALE}/anticipation/approve`,
        {
          sellerId: sellerWallet.user,
          provider: input.provider,
        },
        {
          headers: {
            "x-api-key": process.env.API_KEY_SALE,
          },
        },
      );

      approveAnticipationResponse = response.data;
    } catch (error) {
      console.log("Error on sale anticipation approve ", error?.response?.data);
      if (error?.response?.data) {
        throw new BadRequestException(error.response.data);
      }
      throw error?.response?.data ?? error;
    }
    console.log("approveAnticipationResponse ", approveAnticipationResponse);

    if (!approveAnticipationResponse.success) {
      throw "Approve anticipation error";
    }

    if (approveAnticipationResponse.status === "aproved") {
      return {
        balanceDisponibility: sellerWallet.balanceDisponilibity,
      };
    }

    if (input.provider !== "iugu") {
      await this.createAntecipationTransactionsUseCase.execute({
        request: input.request,
        sellerWallet,
        transactions,
      });
    }
  }
}
export { CreateRevenueAntecipationUsecase };
