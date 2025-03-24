import { Test } from "@nestjs/testing";
import { PrismaService } from "../../../../prisma/prisma.service";
import { TransfeeraCredentialsService } from "../services/transfeera-credentials.service";
import { ListTransfeeraCredentialsUseCase } from "./list-transfeera-credentials.usecase";

describe("Main Flow - List Transfeera Credentials Use Case", () => {
  let sut: ListTransfeeraCredentialsUseCase;
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ListTransfeeraCredentialsUseCase,
        TransfeeraCredentialsService,
        PrismaService,
      ],
    }).compile();
    sut = module.get(ListTransfeeraCredentialsUseCase);
  });
  it("should be defined", () => {
    expect(sut).toBeDefined();
  });
});
