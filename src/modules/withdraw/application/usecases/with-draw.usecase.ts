import { Injectable } from "@nestjs/common";
import AWS from "aws-sdk";
import { RequestService } from "../../../../modules/request/request.service";
import { WalletService } from "../../../../modules/wallet/wallet.service";
import { CreateTransferDTO } from "../../adapters/dto/transfeera/create-transaction.dto";
import { TransfeeraService } from "../services/transfeera.service";
import { PrismaService } from "src/prisma/prisma.service";
import { TransactionService } from "src/modules/transaction/transaction.service";
import { VolutiService } from "../services/voluti.service";

@Injectable()
class WithdrawUseCase {
  constructor(
    private transfeeraService: TransfeeraService,
    private walletService: WalletService,
    private requestService: RequestService,
    private volutiService: VolutiService,
    private readonly transactionService: TransactionService,

    private readonly prismaService: PrismaService,
  ) {}

  async execute(input: CreateTransferDTO): Promise<any> {
    console.log("WithdrawUseCase input ", input);
    const lambda = new AWS.Lambda({ region: process.env.AWS_REGION_APP });

    //To get the wallet
    const walletBeforeUpdate = await this.walletService.findOne(input.walletId);
    //To check if the wallet exists
    if (!walletBeforeUpdate) {
      return { error: "Wallet not found" };
    }
    //To verify if the withdraw was approved
    const approvedRequest =
      await this.requestService.getApprovedWithDrawRequestByAdmin(
        walletBeforeUpdate.adminId,
        input.requestId,
      );
    //To check if there is an approved request
    if (!approvedRequest) {
      return { error: "The withdraw was not approved" };
    }
    //To check if the balance is enough
    if (walletBeforeUpdate.balanceDisponilibity < input.value) {
      return { error: "It was occured an error" };
    }
    try {
      if (input.provider === "voluti") {
        try {
          console.log("isVoluti");
          // make request to do withdraw
          const withdraw = await this.volutiService.withdrawMoney({
            adminId: walletBeforeUpdate.adminId,
            idempotencyKey: approvedRequest.id,
            body: {
              pixKey: input.destination_bank_account.pixKey,
              priority: "NORM",
              payment: {
                amount: Math.round(input.value - input.tax) / 100,
                currency: "BRL",
              },
            },
          });
          await this.requestService.setExternalIdOnRequest(
            approvedRequest.id,
            withdraw.endToEndId,
          );
          return;
        } catch (error) {
          console.log("Error on WithdrawUseCase voluti ", error);
          return { error: "Voluti error" };
        }
      }
      //To update the wallet balance
      const walletUpdated = await this.prismaService.$transaction(
        async (trx) => {
          await this.transactionService.create(
            {
              type: "debit",
              typeInput: "withdrawal",
              value: input.value,
              valueDisponilibity: -input.value,
              date: new Date(),
              walletId: input.walletId,
            },
            trx,
          );

          const walletUpdated = await this.walletService.update(
            input.walletId,
            {
              balanceDisponilibity:
                walletBeforeUpdate.balanceDisponilibity - input.value,
            },
            trx,
          );

          const adminWallet = await this.walletService.findWalletUser(
            walletBeforeUpdate.adminId,
          );
          const acquirerWallet = await this.walletService.findWalletUser(
            `acquirer-${walletBeforeUpdate.adminId}`,
          );
          let acquirerTax = undefined;
          if (adminWallet) {
            await this.transactionService.create(
              {
                type: "deposit",
                typeInput: "withdrawal",
                valueDisponilibity: input.tax,
                value: input.tax,
                date: new Date(),
                walletId: adminWallet.id,
              },
              trx,
            );

            await this.walletService.update(
              adminWallet.id,
              {
                balanceDisponilibity:
                  adminWallet.balanceDisponilibity + input.tax,
              },
              trx,
            );
          }

          //se for iugu chamar a rota do Bruno , se der 200 funcionou
          if (input.provider === "iugu") {
            //To make a axios connectio post to https://api-dev-sale.khure.com.br

            try {
              const payload = {
                resource: "/{any+}",
                path: "/withdrawal",
                httpMethod: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "x-api-key": process.env.API_KEY_SALE,
                },
                pathParameters: { any: "withdrawal" },
                requestContext: {
                  resourcePath: "/{any+}",
                  httpMethod: "POST",
                  path: "/withdrawal",
                },
                body: JSON.stringify({
                  adminId: walletBeforeUpdate.adminId,
                  sellerId: walletBeforeUpdate.user,
                  valueInCents: Math.round(input.value - input.tax),

                  companyName: input.destination_bank_account.companyName,
                  companyDocument:
                    input.destination_bank_account.companyDocument,
                  pixKey: input.destination_bank_account.pixKey,
                  pixKeyType: input.destination_bank_account.pixKeyType,
                  agencyNumber: input.destination_bank_account.agencyNumber,
                  accountNumber: input.destination_bank_account.accountNumber,
                  accountDigit: input.destination_bank_account.accountDigit,
                  accountType: input.destination_bank_account.accountType,
                  externalId: approvedRequest.id,
                }),
                isBase64Encoded: false,
              };

              const params = {
                FunctionName: process.env.SALE_LAMBDA_NAME,
                Payload: JSON.stringify(payload),
              };

              console.log("invoke params ", params);
              const lambdaResponse = await lambda.invoke(params).promise();
              console.log("invoke lambdaResponse ", lambdaResponse);

              const formattedPayload = JSON.parse(
                lambdaResponse.Payload as string,
              );
              console.log("invoke formattedPayload ", formattedPayload);

              const response = JSON.parse(formattedPayload.body);
              console.log("invoke response ", response);

              if (response.error) {
                throw response.error;
              }

              acquirerTax = response.acquirerTax;
            } catch (error) {
              console.log(error);
              // return { error: "Error on iugu" };
              throw "Error on iugu";
            }
          } else if (input.provider === "transfeera") {
            // //To create a transfer
            const transferCreated = await this.transfeeraService.createTransfer(
              {
                ...input,
                value: Math.round(input.value - input.tax),
              },
            );
            //To validate if the transfer was created
            if (!transferCreated) {
              // return { error: "Transfer not created" };
              throw "Transfer not created";
            }
            //To send the transfer
            const transferSent = await this.transfeeraService.sendTransfer({
              id: transferCreated,
              walletId: input.walletId,
            });
            //To verify if the transfer was sent
            if (!transferSent) {
              // return { error: "Transfer not sent" };
              throw "Transfer not sent";
            }
            //To check the new status of the transfer is finalizado
            const transferUpdated =
              await this.transfeeraService.queryCreatedTransfer({
                id: transferCreated,
                walletId: input.walletId,
              });
            if (
              transferUpdated.status != "FINALIZADO" &&
              transferUpdated.status != "RECEBIDO"
            )
              // return { error: "Transfer not finalized" };
              throw "Transfer not finalized";
          }
          if (acquirerWallet && acquirerTax) {
            await this.transactionService.create(
              {
                type: "debit",
                typeInput: "feesAndInterest",
                valueDisponilibity: -acquirerTax,
                description: "Taxa de saque",
                value: acquirerTax,
                date: new Date(),
                walletId: adminWallet.id,
              },
              trx,
            );

            await this.walletService.update(
              adminWallet.id,
              {
                balanceDisponilibity:
                  adminWallet.balanceDisponilibity - acquirerTax,
              },
              trx,
            );

            await this.transactionService.create(
              {
                type: "deposit",
                typeInput: "feesAndInterest",
                valueDisponilibity: acquirerTax,
                value: acquirerTax,
                date: new Date(),
                walletId: acquirerWallet.id,
              },
              trx,
            );

            await this.walletService.update(
              acquirerWallet.id,
              {
                balanceDisponilibity:
                  acquirerWallet.balanceDisponilibity + acquirerTax,
              },
              trx,
            );
          }

          await this.requestService.updateAntecipationRequest(
            approvedRequest.id,
            {
              status: "done",
            },
            trx,
          );

          return walletUpdated;
        },
        {
          timeout: 15000,
        },
      );

      return { data: walletUpdated };
    } catch (error) {
      console.log(error);
      await this.requestService.updateAntecipationRequest(approvedRequest.id, {
        status: "waiting",
      });
      return { error: error };
    }
  }
}
export { WithdrawUseCase };
