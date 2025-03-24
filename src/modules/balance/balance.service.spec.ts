import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "../../prisma/prisma.service";
import { BalanceService } from "./balance.service";
import { InputTransactionWalletDto } from "./dto/input-transaction-wallet.dto";

describe("BalanceService", () => {
  let sut: BalanceService;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BalanceService, PrismaService],
    }).compile();

    sut = module.get<BalanceService>(BalanceService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should be defined", () => {
    expect(sut).toBeDefined();
  });

  it("should to create a new transaction with manual transaction type input and valueblock with 20", async () => {
    const input = {
      userId: "uuid",
      typeInput: "manualTransaction",
      valueBlocked: 20,
      dateUnlock: "2024-02-28 17:03:02.074",
    } as unknown as InputTransactionWalletDto;

    jest.spyOn(sut, "isValidInputTransaction").mockResolvedValue([]);

    const walletMock = {
      id: "14b2d7ef-8a02-4116-a4ed-a8705d391178",
      user: "ab1f088e-cee5-4ef6-86d4-2c2115236f0a",
      balance: 0,
      negativeBalanceLimit: 0,
      balanceBlocked: -80,
      balanceToRelease: 0,
      balanceDisponilibity: 100,
      createdAt: "2024-02-27 19:41:48.205",
      updatedAt: "2024-02-29 17:03:02.074",
      deletedAt: null,
    } as any;
    jest
      .spyOn(prismaService.wallet, "findUnique")
      .mockResolvedValue(walletMock);

    const transactionMock = {
      id: "de8f8636-e924-476c-96a1-f6ab06c73648",
      saleId: null,
      code: "XFE4CM2N7U",
      referenceComissionSale: null,
      type: "deposit",
      typeInput: "manualTransaction",
      priceSale: null,
      value: 0,
      valueBlocked: 20,
      valueToRelease: 0,
      valueDisponilibity: 0,
      date: "2024-02-29",
      dateUnlock: "2024-02-28",
      walletId: "14b2d7ef-8a02-4116-a4ed-a8705d391178",
      description: null,
      anteciped: false,
      createdAt: "2024-02-29 16:40:05.602",
      updatedAt: "2024-02-29 16:42:03.839",
      deletedAt: null,
      requestId: null,
      cardId: null,
      rechargeId: null,
      tax: null,
      availableValue: false,
      hint_walletId_user: "ab1f088e-cee5-4ef6-86d4-2c2115236f0a",
    } as any;

    jest.useFakeTimers();
    jest.setSystemTime(new Date("2023-02-29T00:00:00Z").getTime());

    jest
      .spyOn(prismaService.transactions, "create")
      .mockResolvedValue(transactionMock);
    const result = await sut.inputTransactionWallet(input);

    const output = {
      valueDisponilibity: null,
      valueBlocked: {
        id: "de8f8636-e924-476c-96a1-f6ab06c73648",
        saleId: null,
        code: "XFE4CM2N7U",
        referenceComissionSale: null,
        type: "deposit",
        typeInput: "manualTransaction",
        priceSale: null,
        value: 0,
        valueBlocked: 20,
        valueToRelease: 0,
        valueDisponilibity: 0,
        date: "2024-02-29",
        dateUnlock: "2024-02-28",
        walletId: "14b2d7ef-8a02-4116-a4ed-a8705d391178",
        description: null,
        anteciped: false,
        createdAt: "2024-02-29 16:40:05.602",
        updatedAt: "2024-02-29 16:42:03.839",
        deletedAt: null,
        requestId: null,
        cardId: null,
        rechargeId: null,
        tax: null,
        availableValue: false,
        hint_walletId_user: "ab1f088e-cee5-4ef6-86d4-2c2115236f0a",
      },
      valueToRelease: null,
    };
    expect(result).toMatchObject(output);
  });

  it("should to create a new transaction with manual transaction type input and valueToRelease with 20", async () => {
    const input = {
      userId: "uuid",
      typeInput: "manualTransaction",
      valueToRelease: 20,
      dateUnlock: "2024-02-28 17:03:02.074",
    } as unknown as InputTransactionWalletDto;

    jest.spyOn(sut, "isValidInputTransaction").mockResolvedValue([]);

    const walletMock = {
      id: "14b2d7ef-8a02-4116-a4ed-a8705d391178",
      user: "ab1f088e-cee5-4ef6-86d4-2c2115236f0a",
      balance: 0,
      negativeBalanceLimit: 0,
      balanceBlocked: -80,
      balanceToRelease: 0,
      balanceDisponilibity: 100,
      createdAt: "2024-02-27 19:41:48.205",
      updatedAt: "2024-02-29 17:03:02.074",
      deletedAt: null,
    } as any;
    jest
      .spyOn(prismaService.wallet, "findUnique")
      .mockResolvedValue(walletMock);

    const transactionMock = {
      id: "de8f8636-e924-476c-96a1-f6ab06c73648",
      saleId: null,
      code: "XFE4CM2N7U",
      referenceComissionSale: null,
      type: "deposit",
      typeInput: "manualTransaction",
      priceSale: null,
      value: 0,
      valueBlocked: 0,
      valueToRelease: 20,
      valueDisponilibity: 0,
      date: "2024-02-29",
      dateUnlock: "2024-02-28",
      walletId: "14b2d7ef-8a02-4116-a4ed-a8705d391178",
      description: null,
      anteciped: false,
      createdAt: "2024-02-29 16:40:05.602",
      updatedAt: "2024-02-29 16:42:03.839",
      deletedAt: null,
      requestId: null,
      cardId: null,
      rechargeId: null,
      tax: null,
      availableValue: false,
      hint_walletId_user: "ab1f088e-cee5-4ef6-86d4-2c2115236f0a",
    } as any;

    jest.useFakeTimers();
    jest.setSystemTime(new Date("2023-02-29T00:00:00Z").getTime());

    jest
      .spyOn(prismaService.transactions, "create")
      .mockResolvedValue(transactionMock);
    const output = {
      valueDisponilibity: null,
      valueBlocked: null,
      valueToRelease: {
        id: "de8f8636-e924-476c-96a1-f6ab06c73648",
        saleId: null,
        code: "XFE4CM2N7U",
        referenceComissionSale: null,
        type: "deposit",
        typeInput: "manualTransaction",
        priceSale: null,
        value: 0,
        valueBlocked: 0,
        valueToRelease: 20,
        valueDisponilibity: 0,
        date: "2024-02-29",
        dateUnlock: "2024-02-28",
        walletId: "14b2d7ef-8a02-4116-a4ed-a8705d391178",
        description: null,
        anteciped: false,
        createdAt: "2024-02-29 16:40:05.602",
        updatedAt: "2024-02-29 16:42:03.839",
        deletedAt: null,
        requestId: null,
        cardId: null,
        rechargeId: null,
        tax: null,
        availableValue: false,
        hint_walletId_user: "ab1f088e-cee5-4ef6-86d4-2c2115236f0a",
      },
    };
    const result = await sut.inputTransactionWallet(input);
    expect(result).toMatchObject(output);
  });

  it("should to create a new transaction with manual transaction type input and valueDisponibility with 20", async () => {
    const input = {
      userId: "uuid",
      typeInput: "manualTransaction",
      valueDisponilibity: 20,
      dateUnlock: "2024-02-28 17:03:02.074",
    } as unknown as InputTransactionWalletDto;

    const walletMock = {
      id: "14b2d7ef-8a02-4116-a4ed-a8705d391178",
      user: "ab1f088e-cee5-4ef6-86d4-2c2115236f0a",
      balance: 0,
      negativeBalanceLimit: 0,
      balanceBlocked: 0,
      balanceToRelease: 0,
      balanceDisponilibity: 20,
      createdAt: "2024-02-27 19:41:48.205",
      updatedAt: "2024-02-29 17:03:02.074",
      deletedAt: null,
    } as any;
    jest.spyOn(prismaService.wallet, "update").mockResolvedValue(walletMock);

    const result = await sut.inputTransactionWallet(input);
    const output = {
      valueDisponilibity: {
        id: "14b2d7ef-8a02-4116-a4ed-a8705d391178",
        user: "ab1f088e-cee5-4ef6-86d4-2c2115236f0a",
        balance: 0,
        negativeBalanceLimit: 0,
        balanceBlocked: 0,
        balanceToRelease: 0,
        balanceDisponilibity: 20,
        createdAt: "2024-02-27 19:41:48.205",
        updatedAt: "2024-02-29 17:03:02.074",
        deletedAt: null,
      },
      valueBlocked: null,
      valueToRelease: null,
    };
    expect(result).toMatchObject(output);
  });
});
