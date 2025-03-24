import { Test, TestingModule } from "@nestjs/testing";
import axios from "axios";
import { TransfeeraCredentialsService } from "../../../../modules/transfeera-credentials/application/services/transfeera-credentials.service";
import { WalletService } from "../../../../modules/wallet/wallet.service";
import { PrismaService } from "../../../../prisma/prisma.service";
import { CrytoService } from "../../../../utils/crypto/crypto.service";
import { CreateTransferDTO } from "../../adapters/dto/transfeera/create-transaction.dto";
import { QueryTransfeeraDTO } from "../../adapters/dto/transfeera/query-transfeera.dto";
import { TransfeeraService } from "./transfeera.service";

describe("Main flow of TransfeeraGateway", () => {
  let sut: TransfeeraService;
  let walletService: WalletService;
  let transfeeraCredentialsService: TransfeeraCredentialsService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransfeeraService,
        WalletService,
        TransfeeraCredentialsService,
        CrytoService,
        PrismaService,
      ],
    }).compile();
    sut = module.get<TransfeeraService>(TransfeeraService);
    walletService = module.get<WalletService>(WalletService);
    transfeeraCredentialsService = module.get<TransfeeraCredentialsService>(
      TransfeeraCredentialsService,
    );
  });
  it("should be defined", () => {
    expect(sut).toBeDefined();
  });
  it("should to create a token", async () => {
    const input = "12312";
    jest.spyOn(axios, "post").mockResolvedValueOnce({
      data: {
        access_token: "token",
      },
    });
    jest.spyOn(walletService, "findOne").mockResolvedValueOnce({
      id: "baea42dd-0355-49fc-97e2-0449591daaf6",
      user: "eb16af24-7089-43b8-aacf-abfd68076ff8",
      balance: 0,
      negativeBalanceLimit: 0,
      balanceBlocked: 89533,
      balanceToRelease: 89527,
      balanceDisponilibity: 300,
      createdAt: new Date("2024-05-25 21:54:23.475"),
      updatedAt: new Date("2024-06-21 10:10:18.936"),
      deletedAt: null,
      adminId: "f63f34e6-91d1-48f9-b56f-0900181d8fb1",
      isAdmin: false,
      userInfo: null,
      transactions: null,
    });
    jest
      .spyOn(transfeeraCredentialsService, "findCredentialByAdminId")
      .mockResolvedValueOnce({
        id: "f63f34e6-91d1-48f9-b56f-0900181d8fb1",
        clientId: "f63f34e6-91d1-48f9-b56f-0900181d8fb1",
        clientSecret: "f63f34e6-91d1-48f9-b56f-0900181d8fb1",
        adminId: "f63f34e6-91d1-48f9-b56f-0900181d8fb1",
        createdAt: new Date("2024-06-21 10:10:18.936"),
        updatedAt: new Date("2024-06-21 10:10:18.936"),
        deletedAt: null,
      });
    expect(await sut.createToken(input)).toBe("token");
  });
  it("should to create a transfer", async () => {
    const input = {
      value: 2,
      pix_description: "description",
      destination_bank_account: {
        cpf_cnpj: "30580805000112",
        pix_key: "30580805000112",
        pix_key_type: "CNPJ",
      },
      pix_key_validation: {
        cpf_cnpj: "30580805000112",
      },
    } as CreateTransferDTO;
    jest.spyOn(walletService, "findOne").mockResolvedValueOnce({
      id: "baea42dd-0355-49fc-97e2-0449591daaf6",
      user: "eb16af24-7089-43b8-aacf-abfd68076ff8",
      balance: 0,
      negativeBalanceLimit: 0,
      balanceBlocked: 89533,
      balanceToRelease: 89527,
      balanceDisponilibity: 300,
      createdAt: new Date("2024-05-25 21:54:23.475"),
      updatedAt: new Date("2024-06-21 10:10:18.936"),
      deletedAt: null,
      adminId: "f63f34e6-91d1-48f9-b56f-0900181d8fb1",
      isAdmin: false,
      userInfo: null,
      transactions: null,
    });
    jest
      .spyOn(transfeeraCredentialsService, "findCredentialByAdminId")
      .mockResolvedValueOnce({
        id: "f63f34e6-91d1-48f9-b56f-0900181d8fb1",
        clientId: "f63f34e6-91d1-48f9-b56f-0900181d8fb1",
        clientSecret: "f63f34e6-91d1-48f9-b56f-0900181d8fb1",
        adminId: "f63f34e6-91d1-48f9-b56f-0900181d8fb1",
        createdAt: new Date("2024-06-21 10:10:18.936"),
        updatedAt: new Date("2024-06-21 10:10:18.936"),
        deletedAt: null,
      });
    jest.spyOn(axios, "post").mockResolvedValueOnce({
      data: {
        access_token: "token",
      },
    });
    jest.spyOn(axios, "post").mockResolvedValueOnce({
      data: {
        id: "360468",
      },
    });
    expect(await sut.createTransfer(input)).toBe("360468");
  });
  it("should to query  a created transfer", async () => {
    const input = { id: "360468", walletId: "admin" } as QueryTransfeeraDTO;
    jest.spyOn(walletService, "findOne").mockResolvedValueOnce({
      id: "baea42dd-0355-49fc-97e2-0449591daaf6",
      user: "eb16af24-7089-43b8-aacf-abfd68076ff8",
      balance: 0,
      negativeBalanceLimit: 0,
      balanceBlocked: 89533,
      balanceToRelease: 89527,
      balanceDisponilibity: 300,
      createdAt: new Date("2024-05-25 21:54:23.475"),
      updatedAt: new Date("2024-06-21 10:10:18.936"),
      deletedAt: null,
      adminId: "f63f34e6-91d1-48f9-b56f-0900181d8fb1",
      isAdmin: false,
      userInfo: null,
      transactions: null,
    });
    jest
      .spyOn(transfeeraCredentialsService, "findCredentialByAdminId")
      .mockResolvedValueOnce({
        id: "f63f34e6-91d1-48f9-b56f-0900181d8fb1",
        clientId: "f63f34e6-91d1-48f9-b56f-0900181d8fb1",
        clientSecret: "f63f34e6-91d1-48f9-b56f-0900181d8fb1",
        adminId: "f63f34e6-91d1-48f9-b56f-0900181d8fb1",
        createdAt: new Date("2024-06-21 10:10:18.936"),
        updatedAt: new Date("2024-06-21 10:10:18.936"),
        deletedAt: null,
      });
    jest.spyOn(axios, "post").mockResolvedValueOnce({
      data: {
        access_token: "token",
      },
    });
    jest.spyOn(axios, "get").mockResolvedValueOnce({
      data: {
        id: 360468,
        value: 2,
        status: "RASCUNHO",
        name: "Lote 9",
        payer_name: null,
        payer_cpf_cnpj: null,
        received_date: null,
        returned_date: null,
        finish_date: null,
        created_at: "2024-06-18T16:43:46.000Z",
        reconciled: false,
        is_withdraw: false,
        created_by: {
          name: "Infra",
        },
        type: "TRANSFERENCIA",
        received_bank_account: {
          id: 7,
          agency: "0159",
          account: "13006828-3",
          operation_type: "",
          Bank: {
            id: "1",
            name: "Santander",
            image: "https://cdn.transfeera.com/banks/santander.svg",
          },
        },
      },
    });
    const result = await sut.queryCreatedTransfer(input);
    expect(result.id).toBe(360468);
    expect(result.status).toBe("RASCUNHO");
  });
  it("should to send a transfer", async () => {
    const input = {
      id: "360468",
      walletId: "admin",
    };
    const output = {
      name: "Santander",
      agency: "0159",
      account: "13006828-3",
      type: "",
      company: "Transfeera Pagamentos S.A.",
      cnpj: "27.084.098/0001-69",
    };
    jest.spyOn(walletService, "findOne").mockResolvedValueOnce({
      id: "baea42dd-0355-49fc-97e2-0449591daaf6",
      user: "eb16af24-7089-43b8-aacf-abfd68076ff8",
      balance: 0,
      negativeBalanceLimit: 0,
      balanceBlocked: 89533,
      balanceToRelease: 89527,
      balanceDisponilibity: 300,
      createdAt: new Date("2024-05-25 21:54:23.475"),
      updatedAt: new Date("2024-06-21 10:10:18.936"),
      deletedAt: null,
      adminId: "f63f34e6-91d1-48f9-b56f-0900181d8fb1",
      isAdmin: false,
      userInfo: null,
      transactions: null,
    });
    jest
      .spyOn(transfeeraCredentialsService, "findCredentialByAdminId")
      .mockResolvedValueOnce({
        id: "f63f34e6-91d1-48f9-b56f-0900181d8fb1",
        clientId: "f63f34e6-91d1-48f9-b56f-0900181d8fb1",
        clientSecret: "f63f34e6-91d1-48f9-b56f-0900181d8fb1",
        adminId: "f63f34e6-91d1-48f9-b56f-0900181d8fb1",
        createdAt: new Date("2024-06-21 10:10:18.936"),
        updatedAt: new Date("2024-06-21 10:10:18.936"),
        deletedAt: null,
      });
    jest.spyOn(axios, "post").mockResolvedValueOnce({
      data: {
        access_token: "token",
      },
    });
    jest.spyOn(axios, "post").mockResolvedValueOnce({
      data: output,
    });
    const result = await sut.sendTransfer(input);
    expect(result).toBe(output);
  });
});
