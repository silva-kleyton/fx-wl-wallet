import { Test } from "@nestjs/testing";
import { PrismaService } from "../../../../prisma/prisma.service";
import { TransfeeraCredentialsDTO } from "../../adapter/dto/create-transfeera-credentials.dto";
import { TransfeeraCredentialsService } from "./transfeera-credentials.service";
describe("Main Flow - Transfeera Credentials Service", () => {
  let sut: TransfeeraCredentialsService;
  let prismaService: PrismaService;
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [TransfeeraCredentialsService, PrismaService],
    }).compile();
    sut = module.get(TransfeeraCredentialsService);
    prismaService = module.get(PrismaService);
  });
  it("should be defined", () => {
    expect(sut).toBeDefined();
  });
  it("should to create a new transfeera credentials", async () => {
    const input = {
      clientId: "any_client_id",
      clientSecret: "any_secret",
      adminId: "any_admin_id",
    } as TransfeeraCredentialsDTO;
    const output = {
      id: "84401664-681a-43c7-a139-6d4f24957ca6",
      clientId: "any_client_id",
      clientSecret: "any_secret",
      adminId: "any_admin_id",
      createdAt: new Date("2024-06-21 10:50:46.451"),
      updatedAt: new Date("2024-06-21 10:50:46.451"),
      deletedAt: null,
    };
    jest
      .spyOn(prismaService.transfeeraCredentials, "create")
      .mockResolvedValue(output);
    const result = await sut.create(input);
    expect(result).toMatchObject(output);
  });
});
