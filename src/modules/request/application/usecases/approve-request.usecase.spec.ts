import { Test, TestingModule } from "@nestjs/testing";
import { RequestWhiteListService } from "../../../../modules/request-white-list/application/services/request-white-list.service";
import { RevenueAntecipationService } from "../../../../modules/revenue-antecipation/application/services/revenue-antecipation.service";
import { CreateRevenueAntecipationUsecase } from "../../../../modules/revenue-antecipation/application/use-cases/create-revenue-antecipation.usecase";
import { TransactionService } from "../../../../modules/transaction/transaction.service";
import { WalletService } from "../../../../modules/wallet/wallet.service";
import { PrismaService } from "../../../../prisma/prisma.service";
import { RequestService } from "../../request.service";
import { ApproveRequestUseCase } from "./approve-request.usecase";
describe("Main flow  -  approve request", () => {
  let sut: ApproveRequestUseCase;
  let requestService: RequestService;
  let createRevenueAntecipationUsecase: CreateRevenueAntecipationUsecase;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApproveRequestUseCase,
        CreateRevenueAntecipationUsecase,
        RequestService,
        TransactionService,
        RevenueAntecipationService,
        WalletService,
        RequestWhiteListService,
        PrismaService,
      ],
    }).compile();
    sut = module.get<ApproveRequestUseCase>(ApproveRequestUseCase);
    requestService = module.get<RequestService>(RequestService);
    createRevenueAntecipationUsecase =
      module.get<CreateRevenueAntecipationUsecase>(
        CreateRevenueAntecipationUsecase,
      );
  });
  it("should be defined", () => {
    expect(sut).toBeDefined();
  });
  it("should approve a request", async () => {
    const input = {
      requestId: "1",
      antecipation: {
        walletId: "1",
        tax_per_installment: 0.03,
      },
    };
    const output = { balanceDisponibility: 106032 };
    jest
      .spyOn(requestService, "updateAntecipationRequest")
      .mockResolvedValueOnce({
        id: "243ea1f6-cc41-4ae0-a1c1-d166a175734c",
        userId: "eb16af24-7089-43b8-aacf-abfd68076ff8",
        emailUser: "asd@asd.com",
        status: "aproved",
        description: null,
        evaluatorEmail: null,
        typeRequest: "antecipation",
        closed: false,
        valorRequest: 0,
        valorDescount: 0,
        validate: new Date("2024-06-17T11:21:05.175Z"),
        typeDescount: "thirty",
        tax: 0,
        adminId: "f63f34e6-91d1-48f9-b56f-0900181d8fb1",
        createdAt: new Date("2024-06-10T11:21:05.177Z"),
        updatedAt: new Date("2024-06-10T16:33:09.306Z"),
        deletedAt: null,
      });
    jest.spyOn(createRevenueAntecipationUsecase, "execute").mockResolvedValue({
      balanceDisponibility: 106032,
    });
    const result = await sut.execute(input);
    expect(result).toEqual(output);
  });
});
