import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "../../../../prisma/prisma.service";
import { CrytoService } from "../../../../utils/crypto/crypto.service";
import { UpdateTransfeeraCredentialsDto } from "../../adapter/dto/update-transfeera-credentials.dto";
import { TransfeeraCredentialsService } from "../services/transfeera-credentials.service";
import { UpdateTransfeeraCredentialsUseCase } from "./update-transfeera-credentials.usecase";

describe("Main Flow", () => {
  let sut: UpdateTransfeeraCredentialsUseCase;
  let transfeeraCredentialsService: TransfeeraCredentialsService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateTransfeeraCredentialsUseCase,
        TransfeeraCredentialsService,
        CrytoService,
        PrismaService,
      ],
    }).compile();
    sut = module.get<UpdateTransfeeraCredentialsUseCase>(
      UpdateTransfeeraCredentialsUseCase,
    );
    transfeeraCredentialsService = module.get<TransfeeraCredentialsService>(
      TransfeeraCredentialsService,
    );
  });
  it("should be defined", () => {
    expect(sut).toBeDefined();
  });
  it("should to update a transfeera credentials", async () => {
    const input = {
      clientId: "any_client_id",
      clientSecret: "any_client",
      adminId: "admin-id",
    } as UpdateTransfeeraCredentialsDto;
    const output = {
      id: "5f998c4c-d072-498f-82d4-0a09c7346bf9",
      clientId: "client-id",
      clientSecret: "any_secret1",
      adminId: "admin-id",
      createdAt: new Date("2024-06-21 11:01:53.472"),
      updatedAt: new Date("2024-06-21 14:39:33.378"),
      deletedAt: null,
    };
    jest
      .spyOn(transfeeraCredentialsService, "update")
      .mockResolvedValue(output);

    const result = await sut.execute(input);
    expect(result).toEqual(output);
  });
});

describe("Alternative Flow", () => {
  let sut: UpdateTransfeeraCredentialsUseCase;
  let transfeeraCredentialsService: TransfeeraCredentialsService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateTransfeeraCredentialsUseCase,
        TransfeeraCredentialsService,
        CrytoService,
        PrismaService,
      ],
    }).compile();
    sut = module.get<UpdateTransfeeraCredentialsUseCase>(
      UpdateTransfeeraCredentialsUseCase,
    );
    transfeeraCredentialsService = module.get<TransfeeraCredentialsService>(
      TransfeeraCredentialsService,
    );
  });
  it("should be defined", () => {
    expect(sut).toBeDefined();
  });
  it("should to update a transfeera credentials when the admin id is not found", async () => {
    const input = {
      clientId: "any_client_id",
      clientSecret: "any_client",
      adminId: "admin-id",
    } as UpdateTransfeeraCredentialsDto;

    const output = "Admin not found";
    jest
      .spyOn(transfeeraCredentialsService, "update")
      .mockResolvedValue(output);

    const result = await sut.execute(input);
    expect(result).toEqual(output);
  });
});
