import { Handler, SQSEvent, SQSRecord } from "aws-lambda";
import { plainToInstance } from "class-transformer";
import { BalanceService } from "../modules/balance/balance.service";
import { InputTransactionWalletDto } from "../modules/balance/dto/input-transaction-wallet.dto";
import { PrismaService } from "../prisma/prisma.service";

// const prismaCLient = new PrismaClient({
//   datasources: {
//     db: {
//       url: "file:./dev_qa.db",
//     },
//   },
// });

const prismaService = new PrismaService();
const balanceService = new BalanceService(prismaService);

export const handler: Handler = async (event: SQSEvent) => {
  const records: SQSRecord[] = event.Records;
  for (const record of records) {
    try {
      const body = plainToInstance(
        InputTransactionWalletDto,
        JSON.parse(record.body),
      );
      console.log(`inputTransactionWallet.body `, body);
      return balanceService.inputTransactionWallet(body);
    } catch (error) {
      console.log(`inputTransactionWallet.error `, error);
      throw error;
    }
  }
};
