import { HttpModule } from "@nestjs/axios";
import { Test, TestingModule } from "@nestjs/testing";
import { Producer } from "sqs-producer";
import { PrismaService } from "../../prisma/prisma.service";
import { CoreService } from "../../services/core/core.service";
import { NikyService } from "../../services/niky/niky.service";
import { CreditCardService } from "./credit-card.service";

describe("CreditCardService - Main Flow ", () => {
  let sut: CreditCardService;
  let prismaService: PrismaService;
  let nikyService: NikyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [CreditCardService, NikyService, CoreService, PrismaService],
    }).compile();

    sut = module.get<CreditCardService>(CreditCardService);
    prismaService = module.get<PrismaService>(PrismaService);
    nikyService = module.get<NikyService>(NikyService);
  });

  it("should be defined", () => {
    expect(sut).toBeDefined();
  });

  it("should to discharge a credit card at first time in 24h", async () => {
    const input = {
      cardId: "any_value",
      value: -1,
    } as any;

    const cardMock: any = {
      id: "75f773b9-2ba5-4ffb-8c76-504509daf7d6",
      typeCard: "standard",
      provider: "niky",
      providerId: "8233283854889720",
      facebookDailyReleaseValue: 0,
      walletId: "cd0c3bac-6e88-47b2-9123-1c5a28ee89f8",
      createdAt: "2023-06-27 16:42:16.028",
      updatedAt: "2023-06-27 16:42:16.029",
      deletedAt: null,
      name: "Cartão PJ",
      virtual: true,
      providerCodeRequest: "0001621411",
      typePerson: "PJ",
      hint_walletId_user: "149d9a49-cf85-45a8-8ca8-94ea12847192",
      wallet: {
        userInfo: {
          cpf: "any_cpf",
        },
      },
    };
    jest.spyOn(prismaService.card, "findFirst").mockResolvedValueOnce(cardMock);

    const CardInformationMock = {
      status: "success",
      saldo: 100,
    };
    jest
      .spyOn(nikyService, "CardInformation")
      .mockResolvedValueOnce(CardInformationMock);

    const transactionMock = undefined;
    jest
      .spyOn(prismaService.transactions, "findFirst")
      .mockResolvedValueOnce(transactionMock);

    const createDischargeMock = {
      data: {
        status: "success",
      },
    } as any;
    jest
      .spyOn(nikyService, "createDischarge")
      .mockResolvedValueOnce(createDischargeMock);

    jest.spyOn(Producer, "create").mockReturnValueOnce({
      send: jest.fn(),
    } as any);

    const output = { status: "success" };
    const result = await sut.dischargeCard(input);
    expect(result).toMatchObject(output);
  });
});

describe("CreditCardService - Alternative Flow ", () => {
  let sut: CreditCardService;
  let prismaService: PrismaService;
  let nikyService: NikyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [CreditCardService, NikyService, CoreService, PrismaService],
    }).compile();

    sut = module.get<CreditCardService>(CreditCardService);
    prismaService = module.get<PrismaService>(PrismaService);
    nikyService = module.get<NikyService>(NikyService);
  });

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-02-06T00:00:00.000Z"));
  });

  it("should be defined", () => {
    expect(sut).toBeDefined();
  });

  it("should not to discharge a credit card at second time in 24h", async () => {
    const input = {
      cardId: "any_value",
      value: -1,
    } as any;

    const cardMock: any = {
      id: "75f773b9-2ba5-4ffb-8c76-504509daf7d6",
      typeCard: "standard",
      provider: "niky",
      providerId: "8233283854889720",
      facebookDailyReleaseValue: 0,
      walletId: "cd0c3bac-6e88-47b2-9123-1c5a28ee89f8",
      createdAt: "2023-06-27 16:42:16.028",
      updatedAt: "2023-06-27 16:42:16.029",
      deletedAt: null,
      name: "Cartão PJ",
      virtual: true,
      providerCodeRequest: "0001621411",
      typePerson: "PJ",
      hint_walletId_user: "149d9a49-cf85-45a8-8ca8-94ea12847192",
      wallet: {
        userInfo: {
          cpf: "any_cpf",
        },
      },
    };
    jest.spyOn(prismaService.card, "findFirst").mockResolvedValueOnce(cardMock);

    const CardInformationMock = {
      status: "success",
      saldo: 100,
    };
    jest
      .spyOn(nikyService, "CardInformation")
      .mockResolvedValueOnce(CardInformationMock);

    const transactionMock = {
      id: "98aed42a-1203-4735-9798-88ea680d6da1",
      saleId: null,
      rechargeId: null,
      code: "NEHORNBQAM",
      referenceComissionSale: null,
      type: "deposit",
      typeInput: "dischargeCard",
      requestId: null,
      priceSale: null,
      value: 100,
      tax: 0,
      valueBlocked: 0,
      valueToRelease: 0,
      valueDisponilibity: 100,
      date: "2024-02-06T00:00:00.000Z",
      dateUnlock: null,
      walletId: "d166dd08-c0f6-474a-a5b3-3e70dcbe564a",
      description: null,
      anteciped: false,
      availableValue: false,
      createdAt: "2024-02-06T18:49:09.105Z",
      updatedAt: "2024-02-06T18:49:09.112Z",
      deletedAt: null,
      cardId: "75f773b9-2ba5-4ffb-8c76-504509daf7d6",
    } as any;
    jest
      .spyOn(prismaService.transactions, "findFirst")
      .mockResolvedValueOnce(transactionMock);

    const createDischargeMock = {
      data: {
        status: "success",
      },
    } as any;
    jest
      .spyOn(nikyService, "createDischarge")
      .mockResolvedValueOnce(createDischargeMock);

    jest.spyOn(Producer, "create").mockReturnValueOnce({
      send: jest.fn(),
    } as any);

    const output = { status: "success" };
    await expect(sut.dischargeCard(input)).rejects.toThrow(
      "You can only make one discharge per day",
    );
  });

  it("should to throw a error if the card is not found", async () => {
    const input = {
      cardId: "any_value",
      value: -1,
    } as any;

    jest.spyOn(prismaService.card, "findFirst").mockResolvedValueOnce(null);
    expect(sut.dischargeCard(input)).rejects.toThrow("Card not found");
  });

  it("should to throw a error if the card is blocked", async () => {
    const input = {
      cardId: "any_value",
      value: -1,
    } as any;

    const cardMock: any = {
      id: "75f773b9-2ba5-4ffb-8c76-504509daf7d6",
      typeCard: "standard",
      provider: "niky",
      providerId: "8233283854889720",
      facebookDailyReleaseValue: 0,
      walletId: "cd0c3bac-6e88-47b2-9123-1c5a28ee89f8",
      createdAt: "2023-06-27 16:42:16.028",
      updatedAt: "2023-06-27 16:42:16.029",
      deletedAt: null,
      name: "Cartão PJ",
      virtual: true,
      providerCodeRequest: "0001621411",
      typePerson: "PJ",
      hint_walletId_user: "149d9a49-cf85-45a8-8ca8-94ea12847192",
      wallet: {
        userInfo: {
          cpf: "any_cpf",
        },
      },
    };
    jest.spyOn(prismaService.card, "findFirst").mockResolvedValueOnce(cardMock);

    const CardInformationMock = {
      status: "Bloqueado",
      saldo: 100,
    };
    jest
      .spyOn(nikyService, "CardInformation")
      .mockResolvedValueOnce(CardInformationMock);

    await expect(sut.dischargeCard(input)).rejects.toThrow("Card is blocked");
  });

  it("should to throw a error if the funds is insufficient", async () => {
    const input = {
      cardId: "any_value",
      value: -1,
    } as any;

    const cardMock: any = {
      id: "75f773b9-2ba5-4ffb-8c76-504509daf7d6",
      typeCard: "standard",
      provider: "niky",
      providerId: "8233283854889720",
      facebookDailyReleaseValue: 0,
      walletId: "cd0c3bac-6e88-47b2-9123-1c5a28ee89f8",
      createdAt: "2023-06-27 16:42:16.028",
      updatedAt: "2023-06-27 16:42:16.029",
      deletedAt: null,
      name: "Cartão PJ",
      virtual: true,
      providerCodeRequest: "0001621411",
      typePerson: "PJ",
      hint_walletId_user: "149d9a49-cf85-45a8-8ca8-94ea12847192",
      wallet: {
        userInfo: {
          cpf: "any_cpf",
        },
      },
    };
    jest.spyOn(prismaService.card, "findFirst").mockResolvedValueOnce(cardMock);

    const CardInformationMock = {
      status: "success",
      saldo: -10,
    };
    jest
      .spyOn(nikyService, "CardInformation")
      .mockResolvedValueOnce(CardInformationMock);

    await expect(sut.dischargeCard(input)).rejects.toThrow(
      "Insufficient funds",
    );
  });
});
