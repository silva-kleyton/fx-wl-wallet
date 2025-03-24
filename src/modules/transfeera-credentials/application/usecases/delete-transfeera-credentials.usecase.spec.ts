import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "../../../../prisma/prisma.service";
import { DeleteTransfeeraCredentialsDto } from "../../adapter/dto/delete-transfeera-credentials.dto";
import { TransfeeraCredentialsService } from "../services/transfeera-credentials.service";
import { DeleteTransfeeraCredentialsUseCase } from "./delete-transfeera-credentials.usecase";

describe("Main Flow - Delete Transfeera Credentials", () => {
  let sut: DeleteTransfeeraCredentialsUseCase;
  let prismaService: PrismaService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteTransfeeraCredentialsUseCase,
        TransfeeraCredentialsService,
        PrismaService,
      ],
    }).compile();
    sut = module.get<DeleteTransfeeraCredentialsUseCase>(
      DeleteTransfeeraCredentialsUseCase,
    );
    prismaService = module.get<PrismaService>(PrismaService);
  });
  it("should be defined", () => {
    expect(sut).toBeDefined();
  });
  it("should delete transfeera credentials", async () => {
    const input = {
      adminId: "88177da8-cbb7-42b2-82ef-5bf9e5f88291",
    } as DeleteTransfeeraCredentialsDto;
    const transfeeraCredentialsMock = {
      id: "90bd7546-e203-4a46-b6ba-4e050ecd9540",
      clientId: "ddd",
      clientSecret: "U2FsdGVkX19dymFHIal3Nix2u3VwVM/GWbKTTvSJrc8=",
      adminId: "88177da8-cbb7-42b2-82ef-5bf9e5f88291",
      createdAt: new Date("2024-06-27T22:37:14.111Z"),
      updatedAt: new Date("2024-07-04T10:45:40.113Z"),
      deletedAt: null,
    };
    jest
      .spyOn(prismaService.transfeeraCredentials, "delete")
      .mockResolvedValue(transfeeraCredentialsMock);
    const result = await sut.execute(input);
    const output = { data: "Credentials deleted successfully" };
    expect(result).toMatchObject(output);
  });
});
describe("Alternative Flow - Delete Transfeera Credentials", () => {
  let sut: DeleteTransfeeraCredentialsUseCase;
  let prismaService: PrismaService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteTransfeeraCredentialsUseCase,
        TransfeeraCredentialsService,
        PrismaService,
      ],
    }).compile();
    sut = module.get<DeleteTransfeeraCredentialsUseCase>(
      DeleteTransfeeraCredentialsUseCase,
    );
    prismaService = module.get<PrismaService>(PrismaService);
  });
  it("should be defined", () => {
    expect(sut).toBeDefined();
  });
  it("should not delete transfeera credentials where the admin id does not exists", async () => {
    const input = {
      adminId: "invalid-admin-id",
    } as DeleteTransfeeraCredentialsDto;
    const output = { error: "It was not possible to delete the credentials" };
    jest
      .spyOn(prismaService.transfeeraCredentials, "delete")
      .mockRejectedValueOnce(output);
    const result = await sut.execute(input);
    expect(result).toMatchObject(output);
  });
});
