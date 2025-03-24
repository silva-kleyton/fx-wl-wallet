import { Test, TestingModule } from "@nestjs/testing";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../../prisma/prisma.service";
import { NikyService } from "../../../services/niky/niky.service";
import {
  CardStatus,
  FindAllCardByUserService,
} from "./find-all-card-by-user.service";

const nikyCards = {
  cartao: [
    {
      id: "000000020322955",
      codigo: "8233285325578735",
      pan: "5453XXXXXXXX1216",
      iban: null,
      alias: null,
      codigoStatus: "01",
      status: "Ativo",
      codigoCategoria: "H360BN001",
      codigoProduto: "H360BN001",
      codigoProdutoLogico: null,
      saldo: 15.71,
      flagLimitado: null,
      limite: 100000,
      flagUsoComercial: null,
      codigoGrupoCartao: null,
      nomeGrupoCartao: null,
      codigoGrupoCartaoExt: null,
      portador: [Object],
      cartaoVirtual: true,
    },
    {
      id: "000000020286405",
      codigo: "8233281510666247",
      pan: "5453XXXXXXXX1664",
      iban: null,
      alias: null,
      codigoStatus: "01",
      status: "Ativo",
      codigoCategoria: "H360BN001",
      codigoProduto: "H360BN001",
      codigoProdutoLogico: null,
      saldo: 98.99,
      flagLimitado: null,
      limite: 100000,
      flagUsoComercial: null,
      codigoGrupoCartao: null,
      nomeGrupoCartao: null,
      codigoGrupoCartaoExt: null,
      portador: [Object],
      cartaoVirtual: true,
    },
    {
      id: "000000020286398",
      codigo: "8233280729223731",
      pan: "5453XXXXXXXX8039",
      iban: null,
      alias: null,
      codigoStatus: "ASS",
      status: "Pronto para ativação",
      codigoCategoria: "H360BN001",
      codigoProduto: "H360BN001",
      codigoProdutoLogico: null,
      saldo: 0,
      flagLimitado: null,
      limite: 100000,
      flagUsoComercial: null,
      codigoGrupoCartao: null,
      nomeGrupoCartao: null,
      codigoGrupoCartaoExt: null,
      portador: [Object],
      cartaoVirtual: true,
    },
    {
      id: "000000020286343",
      codigo: "8233286822013145",
      pan: "5453XXXXXXXX1530",
      iban: null,
      alias: null,
      codigoStatus: "ASS",
      status: "Pronto para ativação",
      codigoCategoria: "H360BN001",
      codigoProduto: "H360BN001",
      codigoProdutoLogico: null,
      saldo: 0,
      flagLimitado: null,
      limite: 100000,
      flagUsoComercial: null,
      codigoGrupoCartao: null,
      nomeGrupoCartao: null,
      codigoGrupoCartaoExt: null,
      portador: [Object],
      cartaoVirtual: true,
    },
    {
      id: "000000020270804",
      codigo: "8233282043373135",
      pan: "5453XXXXXXXX6865",
      iban: null,
      alias: null,
      codigoStatus: "03",
      status: "Bloqueado",
      codigoCategoria: "H360BN001",
      codigoProduto: "H360BN001",
      codigoProdutoLogico: null,
      saldo: 43.76,
      flagLimitado: null,
      limite: 100000,
      flagUsoComercial: null,
      codigoGrupoCartao: null,
      nomeGrupoCartao: null,
      codigoGrupoCartaoExt: null,
      portador: [Object],
      cartaoVirtual: true,
    },
    {
      id: "000000020184989",
      codigo: "8233289667129824",
      pan: "5453XXXXXXXX0800",
      iban: null,
      alias: null,
      codigoStatus: "ASS",
      status: "Pronto para ativação",
      codigoCategoria: "H360BN001",
      codigoProduto: "H360BN001",
      codigoProdutoLogico: null,
      saldo: 0,
      flagLimitado: null,
      limite: 100000,
      flagUsoComercial: null,
      codigoGrupoCartao: null,
      nomeGrupoCartao: null,
      codigoGrupoCartaoExt: null,
      portador: [Object],
      cartaoVirtual: false,
    },
    {
      id: "000000019396707",
      codigo: "8233288665507637",
      pan: "5453XXXXXXXX3295",
      iban: null,
      alias: null,
      codigoStatus: "01",
      status: "Ativo",
      codigoCategoria: "H360BN001",
      codigoProduto: "H360BN001",
      codigoProdutoLogico: null,
      saldo: 0,
      flagLimitado: null,
      limite: 100000,
      flagUsoComercial: null,
      codigoGrupoCartao: null,
      nomeGrupoCartao: null,
      codigoGrupoCartaoExt: null,
      portador: [Object],
      cartaoVirtual: true,
    },
    {
      id: "000000019198887",
      codigo: "8233289451896531",
      pan: "5453XXXXXXXX7231",
      iban: null,
      alias: null,
      codigoStatus: "ASS",
      status: "Pronto para ativação",
      codigoCategoria: "H360BN001",
      codigoProduto: "H360BN001",
      codigoProdutoLogico: null,
      saldo: 0,
      flagLimitado: null,
      limite: 100000,
      flagUsoComercial: null,
      codigoGrupoCartao: null,
      nomeGrupoCartao: null,
      codigoGrupoCartaoExt: null,
      portador: [Object],
      cartaoVirtual: false,
    },
    {
      id: "000000019195844",
      codigo: "8233281780496430",
      pan: "5453XXXXXXXX0483",
      iban: null,
      alias: null,
      codigoStatus: "03",
      status: "Bloqueado",
      codigoCategoria: "H360BN001",
      codigoProduto: "H360BN001",
      codigoProdutoLogico: null,
      saldo: 5,
      flagLimitado: null,
      limite: 100000,
      flagUsoComercial: null,
      codigoGrupoCartao: null,
      nomeGrupoCartao: null,
      codigoGrupoCartaoExt: null,
      portador: [Object],
      cartaoVirtual: true,
    },
  ],
};

function checkForCardResponseFormat(sut: any[]) {
  expect(sut[0].name).toEqual(expect.any(String));
  expect(sut[0].id).toEqual(expect.any(String));
  expect(sut[0].codigo).toEqual(expect.any(String));
  expect(sut[0].pan).toEqual(expect.any(String));
  expect(sut[0].iban).toEqual(null);
  expect(sut[0].alias).toEqual(null);
  expect(sut[0].codigoStatus).toEqual(expect.any(String));
  expect(sut[0].status).toEqual(expect.any(String));
  expect(sut[0].codigoCategoria).toEqual(expect.any(String));
  expect(sut[0].codigoProduto).toEqual(expect.any(String));
  expect(sut[0].codigoProdutoLogico).toEqual(null);
  expect(sut[0].saldo).toEqual(expect.any(Number));
  expect(sut[0].flagLimitado).toEqual(null);
  expect(sut[0].limite).toEqual(expect.any(Number));
  expect(sut[0].flagUsoComercial).toEqual(null);
  expect(sut[0].codigoGrupoCartao).toEqual(null);
  expect(sut[0].nomeGrupoCartao).toEqual(null);
  expect(sut[0].codigoGrupoCartaoExt).toEqual(null);
}

describe("FindAllCardByUserService", () => {
  let service: FindAllCardByUserService;
  let prismaService: PrismaService;
  let nikyService: NikyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [FindAllCardByUserService, NikyService, PrismaService],
    }).compile();

    service = module.get<FindAllCardByUserService>(FindAllCardByUserService);
    prismaService = module.get<PrismaService>(PrismaService);
    nikyService = module.get<NikyService>(NikyService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should list all cards if no filter is applied", async () => {
    jest.spyOn(prismaService.wallet, "findFirst").mockResolvedValueOnce({
      id: "id",
      user: "user",
      balance: 100,
      balanceBlocked: 0,
      balanceToRelease: 0,
      balanceDisponilibity: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      negativeBalanceLimit: -1000,
      userInfo: {
        cpf: true,
      },
    } as Awaited<ReturnType<typeof prismaService.wallet.findFirst>> & { userInfo: Prisma.UserInfoSelect });

    jest.spyOn(prismaService.wallet, "findMany").mockResolvedValueOnce([
      {
        id: "id",
        user: "user",
        balance: 100,
        balanceBlocked: 0,
        balanceToRelease: 0,
        balanceDisponilibity: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        negativeBalanceLimit: -1000,
      },
    ] as Awaited<ReturnType<typeof prismaService.wallet.findMany>>);

    jest
      .spyOn(nikyService, "listCardInformation")
      .mockResolvedValueOnce(nikyCards);

    const sut = await service.call("userId");

    expect(sut.length).toBe(4);
    checkForCardResponseFormat(sut);
  });

  it("should list only active cards when filter is applied", async () => {
    jest.spyOn(prismaService.wallet, "findFirst").mockResolvedValueOnce({
      id: "id",
      user: "user",
      balance: 100,
      balanceBlocked: 0,
      balanceToRelease: 0,
      balanceDisponilibity: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      negativeBalanceLimit: -1000,
      userInfo: {
        cpf: true,
      },
    } as Awaited<ReturnType<typeof prismaService.wallet.findFirst>> & { userInfo: Prisma.UserInfoSelect });

    jest.spyOn(prismaService.wallet, "findMany").mockResolvedValueOnce([
      {
        id: "id",
        user: "user",
        balance: 100,
        balanceBlocked: 0,
        balanceToRelease: 0,
        balanceDisponilibity: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        negativeBalanceLimit: -1000,
      },
    ] as Awaited<ReturnType<typeof prismaService.wallet.findMany>>);

    jest
      .spyOn(nikyService, "listCardInformation")
      .mockResolvedValueOnce(nikyCards);

    const sut = await service.call("userId", CardStatus.active);

    expect(sut.length).toBe(2);
    checkForCardResponseFormat(sut);
  });

  it("should list only inactive cards when filter is applied", async () => {
    jest.spyOn(prismaService.wallet, "findFirst").mockResolvedValueOnce({
      id: "id",
      user: "user",
      balance: 100,
      balanceBlocked: 0,
      balanceToRelease: 0,
      balanceDisponilibity: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      negativeBalanceLimit: -1000,
      userInfo: {
        cpf: true,
      },
    } as Awaited<ReturnType<typeof prismaService.wallet.findFirst>> & { userInfo: Prisma.UserInfoSelect });

    jest.spyOn(prismaService.wallet, "findMany").mockResolvedValueOnce([
      {
        id: "id",
        user: "user",
        balance: 100,
        balanceBlocked: 0,
        balanceToRelease: 0,
        balanceDisponilibity: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        negativeBalanceLimit: -1000,
      },
    ] as Awaited<ReturnType<typeof prismaService.wallet.findMany>>);

    jest
      .spyOn(nikyService, "listCardInformation")
      .mockResolvedValueOnce(nikyCards);

    const sut = await service.call("userId", CardStatus.inactive);

    expect(sut.length).toBe(1);
    checkForCardResponseFormat(sut);
  });

  it("should list only blocked cards when filter is applied", async () => {
    jest.spyOn(prismaService.wallet, "findFirst").mockResolvedValueOnce({
      id: "id",
      user: "user",
      balance: 100,
      balanceBlocked: 0,
      balanceToRelease: 0,
      balanceDisponilibity: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      negativeBalanceLimit: -1000,
      userInfo: {
        cpf: true,
      },
    } as Awaited<ReturnType<typeof prismaService.wallet.findFirst>> & { userInfo: Prisma.UserInfoSelect });

    jest.spyOn(prismaService.wallet, "findMany").mockResolvedValueOnce([
      {
        id: "id",
        user: "user",
        balance: 100,
        balanceBlocked: 0,
        balanceToRelease: 0,
        balanceDisponilibity: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        negativeBalanceLimit: -1000,
      },
    ] as Awaited<ReturnType<typeof prismaService.wallet.findMany>>);

    jest
      .spyOn(nikyService, "listCardInformation")
      .mockResolvedValueOnce(nikyCards);

    const sut = await service.call("userId", CardStatus.blocked);

    expect(sut.length).toBe(1);
    checkForCardResponseFormat(sut);
  });
});
