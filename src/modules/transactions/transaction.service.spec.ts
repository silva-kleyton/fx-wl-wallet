import { HttpModule } from "@nestjs/axios";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "../../prisma/prisma.service";
import { CoreService } from "../../services/core/core.service";
import { TransactionsService } from "./transactions.service";
import { CreateManualTransactionDTO } from "./dto/create-manual-transaction.dto";

jest.mock("aws-sdk", () => ({
  config: {
    update: jest.fn(),
  },
}));

jest.mock("sqs-producer", () => ({
  Producer: {
    create: jest.fn().mockReturnValue({
      send: jest.fn().mockResolvedValue([
        {
          Id: "5444c60a-8ac5-46e4-847e-2572e92f9e4d",
          MessageId: "fdec24e4-576f-409c-afe7-d07520d7299b",
          MD5OfMessageBody: "9197087891f5e29698240d0941f58a04",
          SequenceNumber: "18884477584876272128",
        },
      ]),
    }),
  },
}));

describe("Main Flow - TransactionService", () => {
  let sut: TransactionsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [TransactionsService, PrismaService, CoreService],
    }).compile();
    sut = module.get<TransactionsService>(TransactionsService);
  });

  it("should be defined", () => {
    expect(sut).toBeDefined();
  });

  it("should to create a new manual transaction for a user with value blocked with 20 ", async () => {
    const input = {
      userId: "1",
      valueBlocked: 20,
      dateUnlock: "2024-29-02",
    } as unknown as CreateManualTransactionDTO;

    const output = [
      {
        Id: "5444c60a-8ac5-46e4-847e-2572e92f9e4d",
        MessageId: "fdec24e4-576f-409c-afe7-d07520d7299b",
        MD5OfMessageBody: "9197087891f5e29698240d0941f58a04",
        SequenceNumber: "18884477584876272128",
      },
    ];
    const result = await sut.createManualTransaction(input);
    expect(result).toEqual(output);
  });
});
