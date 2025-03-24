// import { Handler, SQSEvent, SQSRecord } from "aws-lambda";
// import { BalanceService } from "../modules/balance/balance.service";
// import { PrismaService } from "../../prisma/prisma.service";
// import { CreateBalanceDto } from "src/modules/balance/dto/create-balance.dto";

// const prismaService = new PrismaService();
// const balanceService = new BalanceService(prismaService);

// export const handler: Handler = async (event: SQSEvent) => {
//   const records: SQSRecord[] = event.Records;

//   console.log("quantidade de mensagens:", records.length);

//   for (const record of records) {
//     const createBalanceDto = <CreateBalanceDto>JSON.parse(record.body);
//     return balanceService.addWalletBalanceForSaleAndCommission(
//       createBalanceDto
//     );
//   }
// };
