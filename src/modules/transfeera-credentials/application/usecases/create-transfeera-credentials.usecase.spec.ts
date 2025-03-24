import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "../../../../prisma/prisma.service";
import { CrytoService } from "../../../../utils/crypto/crypto.service";
import { TransfeeraCredentialsService } from "../services/transfeera-credentials.service";
import { CreateTransfeeraCredentialsUsecase } from "./create-transfeera-credentials.usecase";

describe("Main Flow - Create Transfeera Credentials Usecase", () => {
  let sut: CreateTransfeeraCredentialsUsecase;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTransfeeraCredentialsUsecase,
        TransfeeraCredentialsService,
        CrytoService,
        PrismaService,
      ],
    }).compile();
    sut = module.get<CreateTransfeeraCredentialsUsecase>(
      CreateTransfeeraCredentialsUsecase,
    );
  });
  it("should be defined", () => {
    expect(sut).toBeDefined();
  });
  it("should create a new transfeera credentials", async () => {
    const input = {
      adminId: "admin-id",
      clientId: "client-id",
      clientSecret: "client",
    };
    const result = await sut.execute(input);
    expect(result).toBeDefined();
  });
});
