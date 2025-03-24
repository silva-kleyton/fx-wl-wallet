import { HttpModule } from "@nestjs/axios";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "../../prisma/prisma.service";
import { CoreService } from "../../services/core/core.service";
import { TransactionsController } from "./transactions.controller";
import { TransactionsService } from "./transactions.service";

describe("Main Flow - Transaction Controller", () => {
  let sut: TransactionsController;
  let transactionsService: TransactionsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        TransactionsController,
        TransactionsService,
        CoreService,
        PrismaService,
      ],
    }).compile();
    sut = module.get<TransactionsController>(TransactionsController);
    transactionsService = module.get<TransactionsService>(TransactionsService);
  });

  it("should be defined", () => {
    expect(sut).toBeDefined();
  });

  it("should to create a new manual transaction for a user with value blocked with 20 ", async () => {
    const input = {
      userId: "1",
      valueBlocked: 20,
      dateUnlock: "2024-29-02",
    } as any;
    const output = [
      {
        Id: "5444c60a-8ac5-46e4-847e-2572e92f9e4d",
        MessageId: "fdec24e4-576f-409c-afe7-d07520d7299b",
        MD5OfMessageBody: "9197087891f5e29698240d0941f58a04",
        SequenceNumber: "18884477584876272128",
      },
    ];
    jest
      .spyOn(transactionsService, "createManualTransaction")
      .mockResolvedValue(output);
    const result = await sut.createManualTransaction(input);
    expect(result).toEqual(output);
  });
});
