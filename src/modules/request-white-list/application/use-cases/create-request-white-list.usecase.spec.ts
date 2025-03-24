import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "../../../../prisma/prisma.service";
import { CreateRequestWhiteListDTO } from "../../adapters/dto/create-request-white-list.dto";
import { RequestWhiteListService } from "../services/request-white-list.service";
import { CreateRequestWhiteListUseCase } from "./create-request-white-list.usecase";

describe("Main Flow - Create Request White List", () => {
  let sut: CreateRequestWhiteListUseCase;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateRequestWhiteListUseCase,
        RequestWhiteListService,
        PrismaService,
      ],
    }).compile();
    sut = module.get(CreateRequestWhiteListUseCase);
    prismaService = module.get(PrismaService);
  });
  it("should be defined", () => {
    expect(sut).toBeDefined();
  });
  it("should to create a request white list", async () => {
    const input = {
      walletId: "any_value",
      typeRequest: "antecipation",
      isActive: true,
    } as CreateRequestWhiteListDTO;
    jest.spyOn(prismaService.requestWhiteList, "create").mockResolvedValue({
      id: "cbc726b5-3cf4-495c-a541-678aa2b119fa",
      walletId: "baea42dd-0355-49fc-97e2-0449591daaf6",
      typeRequest: "antecipation",
      isActive: true,
      adminId: "f63f34e6-91d1-48f9-b56f-0900181d8fb1",
      createdAt: new Date("2024-06-10"),
    });
    const result = await sut.execute(input);
    const output = {
      id: "cbc726b5-3cf4-495c-a541-678aa2b119fa",
      walletId: "baea42dd-0355-49fc-97e2-0449591daaf6",
      typeRequest: "antecipation",
      isActive: true,
      adminId: "f63f34e6-91d1-48f9-b56f-0900181d8fb1",
    };
    expect(result).toMatchObject(output);
  });
});

describe("Alternative Flow - Create Request White List", () => {
  let sut: CreateRequestWhiteListUseCase;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateRequestWhiteListUseCase,
        RequestWhiteListService,
        PrismaService,
      ],
    }).compile();
    sut = module.get(CreateRequestWhiteListUseCase);
    prismaService = module.get(PrismaService);
  });
  it("should be defined", () => {
    expect(sut).toBeDefined();
  });
  it("should not to create a request white list duplicated", async () => {
    const input = {
      walletId: "any_value",
      typeRequest: "antecipation",
      isActive: true,
    } as CreateRequestWhiteListDTO;
    jest
      .spyOn(prismaService.requestWhiteList, "findFirst")
      .mockResolvedValueOnce({
        id: "cbc726b5-3cf4-495c-a541-678aa2b119fa",
        walletId: "baea42dd-0355-49fc-97e2-0449591daaf6",
        typeRequest: "antecipation",
        isActive: true,
        adminId: "f63f34e6-91d1-48f9-b56f-0900181d8fb1",
        createdAt: new Date("2024-06-10"),
      });
    const result = await sut.execute(input);
    const output = "Request white List already exists";
    expect(result).toBe(output);
  });
});
