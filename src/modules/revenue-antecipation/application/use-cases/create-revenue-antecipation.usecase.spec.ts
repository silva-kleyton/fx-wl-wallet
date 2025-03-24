import { Test, TestingModule } from "@nestjs/testing";
import { RequestWhiteListService } from "../../../../modules/request-white-list/application/services/request-white-list.service";
import { RequestService } from "../../../../modules/request/request.service";
import { TransactionService } from "../../../../modules/transaction/transaction.service";
import { WalletService } from "../../../../modules/wallet/wallet.service";
import { PrismaService } from "../../../../prisma/prisma.service";
import { CreateRevenueAntecipationDto } from "../../adapters/dto/create-revenue-antecipation.dto";
import { RevenueAntecipationService } from "../services/revenue-antecipation.service";
import { CreateRevenueAntecipationUsecase } from "./create-revenue-antecipation.usecase";

describe("Main Flow - Revenue Antecipation Usecase", () => {
  let sut: CreateRevenueAntecipationUsecase;
  let prismaService: PrismaService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateRevenueAntecipationUsecase,
        TransactionService,
        RevenueAntecipationService,
        WalletService,
        RequestWhiteListService,
        RequestService,
        PrismaService,
      ],
    }).compile();
    sut = module.get<CreateRevenueAntecipationUsecase>(
      CreateRevenueAntecipationUsecase,
    );
    prismaService = module.get<PrismaService>(PrismaService);
  });
  it("should to be defined", () => {
    expect(sut).toBeDefined();
  });
  it("should to create a manual revenue antecipation", async () => {
    jest.useFakeTimers().setSystemTime(new Date("2024-06-03"));
    jest.spyOn(prismaService.transactions, "findMany").mockResolvedValueOnce([
      {
        id: "14f7c0bc-6681-4751-9bff-aaff3811b765",
        saleId: "2680cbfc-545c-4c65-8923-4f790083d8c7",
        rechargeId: null,
        code: "KWG86U35VN",
        referenceComissionSale: "e743d658-6321-4dd4-9c65-07acca06d993",
        type: "deposit",
        typeInput: "sellerCommission",
        requestId: null,
        priceSale: 500,
        value: 425,
        tax: null,
        valueBlocked: 213,
        valueToRelease: 212,
        valueDisponilibity: 0,
        date: new Date("2024-06-03T00:00:00.000Z"),
        dateUnlock: new Date("2024-07-03T00:00:00.000Z"),
        walletId: "baea42dd-0355-49fc-97e2-0449591daaf6",
        description: null,
        anteciped: false,
        availableValue: false,
        createdAt: new Date("2024-06-03T19:39:53.946Z"),
        updatedAt: new Date("2024-06-03T19:39:53.946Z"),
        deletedAt: null,
        cardId: null,
        adminId: null,
      },
    ]);
    jest.spyOn(prismaService.wallet, "findFirst").mockResolvedValueOnce({
      id: "baea42dd-0355-49fc-97e2-0449591daaf6",
      user: "eb16af24-7089-43b8-aacf-abfd68076ff8",
      balance: 0,
      negativeBalanceLimit: 0,
      balanceBlocked: 89533,
      balanceToRelease: 89527,
      balanceDisponilibity: 0,
      createdAt: new Date("2024-05-25 21:54:23.475"),
      updatedAt: new Date("2024-06-04 13:54:01.717"),
      deletedAt: null,
      adminId: "f63f34e6-91d1-48f9-b56f-0900181d8fb1",
      isAdmin: false,
    });
    jest.spyOn(prismaService.wallet, "update").mockResolvedValueOnce({
      id: "baea42dd-0355-49fc-97e2-0449591daaf6",
      user: "eb16af24-7089-43b8-aacf-abfd68076ff8",
      balance: 0,
      negativeBalanceLimit: 0,
      balanceBlocked: 89533,
      balanceToRelease: 89527,
      balanceDisponilibity: 421,
      createdAt: new Date("2024-05-25 21:54:23.475"),
      updatedAt: new Date("2024-06-04 13:54:01.717"),
      deletedAt: null,
      adminId: null,
      isAdmin: false,
    });
    jest.spyOn(prismaService.wallet, "findFirst").mockResolvedValueOnce({
      id: "f63f34e6-91d1-48f9-b56f-0900181d8fb1",
      user: "edfaa2a7-3989-4e34-bc41-2ed78943f351",
      balance: 0,
      negativeBalanceLimit: 0,
      balanceBlocked: 0,
      balanceToRelease: 0,
      balanceDisponilibity: 0,
      createdAt: new Date("2024-06-04 14:37:45.721"),
      updatedAt: new Date("2024-06-04 14:37:45.721"),
      deletedAt: null,
      adminId: "5f81b909-7123-45ea-900a-add2fed44b63",
      isAdmin: false,
    });
    jest.spyOn(prismaService.wallet, "update").mockResolvedValueOnce({
      id: "f63f34e6-91d1-48f9-b56f-0900181d8fb1",
      user: "edfaa2a7-3989-4e34-bc41-2ed78943f351",
      balance: 0,
      negativeBalanceLimit: 0,
      balanceBlocked: 0,
      balanceToRelease: 0,
      balanceDisponilibity: 4,
      createdAt: new Date("2024-06-04 14:37:45.721"),
      updatedAt: new Date("2024-06-04 14:37:45.721"),
      deletedAt: null,
      adminId: "5f81b909-7123-45ea-900a-add2fed44b63",
      isAdmin: false,
    });
    jest.spyOn(prismaService.request, "findFirst").mockResolvedValueOnce(null);
    jest.spyOn(prismaService.request, "findFirst").mockResolvedValueOnce({
      id: "243ea1f6-cc41-4ae0-a1c1-d166a175734c",
      emailUser: "asd@asd.com",
      status: "aproved",
      description: null,
      evaluatorEmail: null,
      typeRequest: "antecipation",
      closed: false,
      valorRequest: 0,
      valorDescount: 0,
      validate: new Date("2024-06-17 11:21:05.175"),
      typeDescount: "thirty",
      createdAt: new Date("2024-06-10 11:21:05.177"),
      updatedAt: new Date("2024-06-10 18:43:39.623"),
      deletedAt: null,
      tax: 0,
      adminId: "f63f34e6-91d1-48f9-b56f-0900181d8fb1",
      userId: "eb16af24-7089-43b8-aacf-abfd68076ff8",
    });
    jest.spyOn(prismaService.transactions, "create").mockResolvedValueOnce({
      id: "92577b67-ae69-4665-b3df-62b968ce4047",
      saleId: null,
      code: null,
      referenceComissionSale: null,
      type: "deposit",
      typeInput: null,
      priceSale: null,
      value: 420,
      valueBlocked: 0,
      valueToRelease: 0,
      valueDisponilibity: 420,
      date: new Date("2024-06-03"),
      dateUnlock: null,
      walletId: "baea42dd-0355-49fc-97e2-0449591daaf6",
      description: "Antecipação de receita",
      anteciped: false,
      createdAt: new Date("2024-06-04 18:48:25.721"),
      updatedAt: new Date("2024-06-04 18:48:25.721"),
      deletedAt: null,
      requestId: null,
      cardId: null,
      rechargeId: null,
      tax: null,
      availableValue: false,
      adminId: null,
    });
    jest.spyOn(prismaService.balanceHistory, "create").mockResolvedValueOnce({
      id: "d8ad8544-da59-45d1-a83f-cf5e1db60aed",
      balanceBlocked: 0,
      balanceToRelease: 0,
      balanceDisponilibity: 420,
      createdAt: new Date("2024-05-25 23:39:46.295"),
      updatedAt: new Date("2024-05-25 23:39:46.295"),
      deletedAt: null,
      transactionId: "92577b67-ae69-4665-b3df-62b968ce4047",
    });
    jest.spyOn(prismaService.request, "findFirst").mockResolvedValueOnce({
      id: "243ea1f6-cc41-4ae0-a1c1-d166a175734c",
      emailUser: "asd@asd.com",
      status: "aproved",
      description: null,
      evaluatorEmail: null,
      typeRequest: "antecipation",
      closed: false,
      valorRequest: 0,
      valorDescount: 0,
      validate: new Date("2024-06-17 11:21:05.175"),
      typeDescount: "thirty",
      createdAt: new Date("2024-06-10 11:21:05.177"),
      updatedAt: new Date("2024-06-10 18:43:39.623"),
      deletedAt: null,
      tax: 0,
      adminId: "f63f34e6-91d1-48f9-b56f-0900181d8fb1",
      userId: "eb16af24-7089-43b8-aacf-abfd68076ff8",
    });
    jest.spyOn(prismaService.request, "update").mockResolvedValueOnce({
      id: "243ea1f6-cc41-4ae0-a1c1-d166a175734c",
      emailUser: "asd@asd.com",
      status: "done",
      description: null,
      evaluatorEmail: null,
      typeRequest: "antecipation",
      closed: false,
      valorRequest: 0,
      valorDescount: 0,
      validate: new Date("2024-06-17 11:21:05.175"),
      typeDescount: "thirty",
      createdAt: new Date("2024-06-10 11:21:05.177"),
      updatedAt: new Date("2024-06-10 18:43:39.623"),
      deletedAt: null,
      tax: 0,
      adminId: "f63f34e6-91d1-48f9-b56f-0900181d8fb1",
      userId: "eb16af24-7089-43b8-aacf-abfd68076ff8",
    });
    const input = {
      walletId: "baea42dd-0355-49fc-97e2-0449591daaf6",
      tax_per_installment: 0.01,
    } as CreateRevenueAntecipationDto;
    const output = { balanceDisponibility: 421 };
    const result = await sut.execute(input);
    expect(result).toMatchObject(output);
  });
  it("should to create a automatic revenue antecipation", async () => {
    jest.useFakeTimers().setSystemTime(new Date("2024-06-03"));
    jest.spyOn(prismaService.transactions, "findMany").mockResolvedValueOnce([
      {
        id: "14f7c0bc-6681-4751-9bff-aaff3811b765",
        saleId: "2680cbfc-545c-4c65-8923-4f790083d8c7",
        rechargeId: null,
        code: "KWG86U35VN",
        referenceComissionSale: "e743d658-6321-4dd4-9c65-07acca06d993",
        type: "deposit",
        typeInput: "sellerCommission",
        requestId: null,
        priceSale: 500,
        value: 425,
        tax: null,
        valueBlocked: 213,
        valueToRelease: 212,
        valueDisponilibity: 0,
        date: new Date("2024-06-03T00:00:00.000Z"),
        dateUnlock: new Date("2024-07-03T00:00:00.000Z"),
        walletId: "baea42dd-0355-49fc-97e2-0449591daaf6",
        description: null,
        anteciped: false,
        availableValue: false,
        createdAt: new Date("2024-06-03T19:39:53.946Z"),
        updatedAt: new Date("2024-06-03T19:39:53.946Z"),
        deletedAt: null,
        cardId: null,
        adminId: null,
      },
    ]);
    jest.spyOn(prismaService.wallet, "findFirst").mockResolvedValueOnce({
      id: "baea42dd-0355-49fc-97e2-0449591daaf6",
      user: "eb16af24-7089-43b8-aacf-abfd68076ff8",
      balance: 0,
      negativeBalanceLimit: 0,
      balanceBlocked: 89533,
      balanceToRelease: 89527,
      balanceDisponilibity: 0,
      createdAt: new Date("2024-05-25 21:54:23.475"),
      updatedAt: new Date("2024-06-04 13:54:01.717"),
      deletedAt: null,
      adminId: "f63f34e6-91d1-48f9-b56f-0900181d8fb1",
      isAdmin: false,
    });
    jest.spyOn(prismaService.wallet, "update").mockResolvedValueOnce({
      id: "baea42dd-0355-49fc-97e2-0449591daaf6",
      user: "eb16af24-7089-43b8-aacf-abfd68076ff8",
      balance: 0,
      negativeBalanceLimit: 0,
      balanceBlocked: 89533,
      balanceToRelease: 89527,
      balanceDisponilibity: 421,
      createdAt: new Date("2024-05-25 21:54:23.475"),
      updatedAt: new Date("2024-06-04 13:54:01.717"),
      deletedAt: null,
      adminId: null,
      isAdmin: false,
    });
    jest.spyOn(prismaService.wallet, "findFirst").mockResolvedValueOnce({
      id: "f63f34e6-91d1-48f9-b56f-0900181d8fb1",
      user: "edfaa2a7-3989-4e34-bc41-2ed78943f351",
      balance: 0,
      negativeBalanceLimit: 0,
      balanceBlocked: 0,
      balanceToRelease: 0,
      balanceDisponilibity: 0,
      createdAt: new Date("2024-06-04 14:37:45.721"),
      updatedAt: new Date("2024-06-04 14:37:45.721"),
      deletedAt: null,
      adminId: "5f81b909-7123-45ea-900a-add2fed44b63",
      isAdmin: false,
    });
    jest.spyOn(prismaService.wallet, "update").mockResolvedValueOnce({
      id: "f63f34e6-91d1-48f9-b56f-0900181d8fb1",
      user: "edfaa2a7-3989-4e34-bc41-2ed78943f351",
      balance: 0,
      negativeBalanceLimit: 0,
      balanceBlocked: 0,
      balanceToRelease: 0,
      balanceDisponilibity: 4,
      createdAt: new Date("2024-06-04 14:37:45.721"),
      updatedAt: new Date("2024-06-04 14:37:45.721"),
      deletedAt: null,
      adminId: "5f81b909-7123-45ea-900a-add2fed44b63",
      isAdmin: false,
    });
    jest.spyOn(prismaService.request, "findFirst").mockResolvedValueOnce(null);
    jest.spyOn(prismaService.request, "findFirst").mockResolvedValueOnce({
      id: "243ea1f6-cc41-4ae0-a1c1-d166a175734c",
      emailUser: "asd@asd.com",
      status: "aproved",
      description: null,
      evaluatorEmail: null,
      typeRequest: "antecipation",
      closed: false,
      valorRequest: 0,
      valorDescount: 0,
      validate: new Date("2024-06-17 11:21:05.175"),
      typeDescount: "thirty",
      createdAt: new Date("2024-06-10 11:21:05.177"),
      updatedAt: new Date("2024-06-10 18:43:39.623"),
      deletedAt: null,
      tax: 0,
      adminId: "f63f34e6-91d1-48f9-b56f-0900181d8fb1",
      userId: "eb16af24-7089-43b8-aacf-abfd68076ff8",
    });
    jest.spyOn(prismaService.transactions, "create").mockResolvedValueOnce({
      id: "92577b67-ae69-4665-b3df-62b968ce4047",
      saleId: null,
      code: null,
      referenceComissionSale: null,
      type: "deposit",
      typeInput: null,
      priceSale: null,
      value: 420,
      valueBlocked: 0,
      valueToRelease: 0,
      valueDisponilibity: 420,
      date: new Date("2024-06-03"),
      dateUnlock: null,
      walletId: "baea42dd-0355-49fc-97e2-0449591daaf6",
      description: "Antecipação de receita",
      anteciped: false,
      createdAt: new Date("2024-06-04 18:48:25.721"),
      updatedAt: new Date("2024-06-04 18:48:25.721"),
      deletedAt: null,
      requestId: null,
      cardId: null,
      rechargeId: null,
      tax: null,
      availableValue: false,
      adminId: null,
    });
    jest.spyOn(prismaService.balanceHistory, "create").mockResolvedValueOnce({
      id: "d8ad8544-da59-45d1-a83f-cf5e1db60aed",
      balanceBlocked: 0,
      balanceToRelease: 0,
      balanceDisponilibity: 420,
      createdAt: new Date("2024-05-25 23:39:46.295"),
      updatedAt: new Date("2024-05-25 23:39:46.295"),
      deletedAt: null,
      transactionId: "92577b67-ae69-4665-b3df-62b968ce4047",
    });
    jest.spyOn(prismaService.request, "findFirst").mockResolvedValueOnce({
      id: "243ea1f6-cc41-4ae0-a1c1-d166a175734c",
      emailUser: "asd@asd.com",
      status: "aproved",
      description: null,
      evaluatorEmail: null,
      typeRequest: "antecipation",
      closed: false,
      valorRequest: 0,
      valorDescount: 0,
      validate: new Date("2024-06-17 11:21:05.175"),
      typeDescount: "thirty",
      createdAt: new Date("2024-06-10 11:21:05.177"),
      updatedAt: new Date("2024-06-10 18:43:39.623"),
      deletedAt: null,
      tax: 0,
      adminId: "f63f34e6-91d1-48f9-b56f-0900181d8fb1",
      userId: "eb16af24-7089-43b8-aacf-abfd68076ff8",
    });
    jest.spyOn(prismaService.request, "update").mockResolvedValueOnce({
      id: "243ea1f6-cc41-4ae0-a1c1-d166a175734c",
      emailUser: "asd@asd.com",
      status: "done",
      description: null,
      evaluatorEmail: null,
      typeRequest: "antecipation",
      closed: false,
      valorRequest: 0,
      valorDescount: 0,
      validate: new Date("2024-06-17 11:21:05.175"),
      typeDescount: "thirty",
      createdAt: new Date("2024-06-10 11:21:05.177"),
      updatedAt: new Date("2024-06-10 18:43:39.623"),
      deletedAt: null,
      tax: 0,
      adminId: "f63f34e6-91d1-48f9-b56f-0900181d8fb1",
      userId: "eb16af24-7089-43b8-aacf-abfd68076ff8",
    });
    jest
      .spyOn(prismaService.requestWhiteList, "findFirst")
      .mockResolvedValueOnce({
        id: "d285e33b-ed1e-4848-846e-87a731087950",
        walletId: "baea42dd-0355-49fc-97e2-0449591daaf6",
        typeRequest: "antecipation",
        isActive: true,
        adminId: "f63f34e6-91d1-48f9-b56f-0900181d8fb1",
        createdAt: new Date("2024-06-10 21:24:01.803"),
      });
    const input = {
      walletId: "baea42dd-0355-49fc-97e2-0449591daaf6",
      tax_per_installment: 0.01,
    } as CreateRevenueAntecipationDto;
    const output = { balanceDisponibility: 421 };
    const result = await sut.execute(input);
    expect(result).toMatchObject(output);
  });
});
