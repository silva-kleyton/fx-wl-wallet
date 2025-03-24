import { Test, TestingModule } from "@nestjs/testing";
import { RevenueAntecipationService } from "../../../../modules/revenue-antecipation/application/services/revenue-antecipation.service";
import { TransactionService } from "../../../../modules/transaction/transaction.service";
import { PrismaService } from "../../../../prisma/prisma.service";
import { RequestService } from "../../request.service";
import { ApproveWithdrawUseCase } from "./approve-withdraw.usecase";

describe("Main Flow - Approve Withdraw", () => {
  let sut: ApproveWithdrawUseCase;
  let prismaService: PrismaService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApproveWithdrawUseCase,
        RequestService,
        PrismaService,
        TransactionService,
        RevenueAntecipationService,
      ],
    }).compile();
    sut = module.get<ApproveWithdrawUseCase>(ApproveWithdrawUseCase);
    prismaService = module.get<PrismaService>(PrismaService);
  });
  it("should be defined", () => {
    expect(sut).toBeDefined();
  });
  it("should approve a withdraw request", async () => {
    const input = "887c572e-facc-4598-bed9-579f87bb86c8";
    jest.spyOn(prismaService.request, "update").mockResolvedValueOnce({
      id: "887c572e-facc-4598-bed9-579f87bb86c8",
      emailUser: "asd@asd.com",
      status: "waiting",
      description: null,
      evaluatorEmail: null,
      typeRequest: "antecipation",
      closed: false,
      valorRequest: 0,
      valorDescount: 0,
      validate: new Date("2024-06-24 12:15:57.835"),
      typeDescount: "thirty",
      createdAt: new Date("2024-06-17 12:15:57.837"),
      updatedAt: new Date("2024-06-26 18:40:40.993"),
      deletedAt: null,
      tax: 0,
      adminId: "f63f34e6-91d1-48f9-b56f-0900181d8fb1",
      userId: "eb16af24-7089-43b8-aacf-abfd68076ff8",
    });
    const output = {
      id: "887c572e-facc-4598-bed9-579f87bb86c8",
      emailUser: "asd@asd.com",
      status: "waiting",
      description: null,
      evaluatorEmail: null,
      typeRequest: "antecipation",
      closed: false,
      valorRequest: 0,
      valorDescount: 0,
      validate: new Date("2024-06-24 12:15:57.835"),
      typeDescount: "thirty",
      createdAt: new Date("2024-06-17 12:15:57.837"),
      updatedAt: new Date("2024-06-26 18:40:40.993"),
      deletedAt: null,
      tax: 0,
      adminId: "f63f34e6-91d1-48f9-b56f-0900181d8fb1",
      userId: "eb16af24-7089-43b8-aacf-abfd68076ff8",
    };
    const result = await sut.execute(input);
    expect(result).toEqual(output);
  });
});
