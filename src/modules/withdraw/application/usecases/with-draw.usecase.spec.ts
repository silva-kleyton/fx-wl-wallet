import { Test, TestingModule } from "@nestjs/testing";
import { RequestService } from "../../../../modules/request/request.service";
import { RevenueAntecipationService } from "../../../../modules/revenue-antecipation/application/services/revenue-antecipation.service";
import { TransactionService } from "../../../../modules/transaction/transaction.service";
import { TransfeeraCredentialsService } from "../../../../modules/transfeera-credentials/application/services/transfeera-credentials.service";
import { WalletService } from "../../../../modules/wallet/wallet.service";
import { PrismaService } from "../../../../prisma/prisma.service";
import { CrytoService } from "../../../../utils/crypto/crypto.service";
import { CreateTransferDTO } from "../../adapters/dto/transfeera/create-transaction.dto";
import { TransfeeraService } from "../services/transfeera.service";
import { WithdrawUseCase } from "./with-draw.usecase";

describe("Main Flow of Withdraw UseCase", () => {
  let sut: WithdrawUseCase;
  let transfeeraService: TransfeeraService;
  let walletService: WalletService;
  let requestService: RequestService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WithdrawUseCase,
        TransfeeraService,
        WalletService,
        TransfeeraCredentialsService,
        CrytoService,
        RequestService,
        TransactionService,
        RevenueAntecipationService,
        PrismaService,
      ],
    }).compile();
    sut = module.get<WithdrawUseCase>(WithdrawUseCase);
    transfeeraService = module.get<TransfeeraService>(TransfeeraService);
    walletService = module.get<WalletService>(WalletService);
    requestService = module.get<RequestService>(RequestService);
  });
  it("should be defined", () => {
    expect(sut).toBeDefined();
  });
  it("should to withdraw", async () => {
    const input = {
      value: 100,
      pix_description: "Pix description",
      destination_bank_account: {
        cpf_cnpj: "12345678901",
        email: "asd@asd.com",
        pix_key: "12345678901",
        pix_key_type: "CPF",
      },
      pix_key_validation: {
        cpf_cnpj: "12345678901",
      },
    } as CreateTransferDTO;

    jest
      .spyOn(transfeeraService, "createTransfer")
      .mockResolvedValueOnce("360468");
    const sendTransferMock = {
      name: "Santander",
      agency: "0159",
      account: "13006828-3",
      type: "",
      company: "Transfeera Pagamentos S.A.",
      cnpj: "27.084.098/0001-69",
    };
    jest
      .spyOn(transfeeraService, "sendTransfer")
      .mockResolvedValueOnce(sendTransferMock);
    const queryCreatedTransferMock = {
      id: 360568,
      value: 2,
      status: "FINALIZADO",
      name: "Lote 13",
      payer_name: null,
      payer_cpf_cnpj: null,
      received_date: "2024-06-20T09:53:19.000Z",
      returned_date: null,
      finish_date: "2024-06-20T09:53:20.000Z",
      created_at: "2024-06-20T09:50:42.000Z",
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
    };
    jest
      .spyOn(transfeeraService, "queryCreatedTransfer")
      .mockResolvedValueOnce(queryCreatedTransferMock);
    const walletMockFindFirst = {
      id: "baea42dd-0355-49fc-97e2-0449591daaf6",
      user: "eb16af24-7089-43b8-aacf-abfd68076ff8",
      balance: 0,
      negativeBalanceLimit: 0,
      balanceBlocked: 89533,
      balanceToRelease: 89527,
      balanceDisponilibity: 106032,
      createdAt: new Date("2024-05-25 21:54:23.475"),
      updatedAt: new Date("2024-06-11 12:35:12.043"),
      deletedAt: null,
      adminId: "f63f34e6-91d1-48f9-b56f-0900181d8fb1",
      isAdmin: false,
      transactions: null,
      userInfo: null,
    };
    jest
      .spyOn(walletService, "findOne")
      .mockResolvedValueOnce(walletMockFindFirst);
    const walletMockUpdate = {
      id: "baea42dd-0355-49fc-97e2-0449591daaf6",
      user: "eb16af24-7089-43b8-aacf-abfd68076ff8",
      balance: 0,
      negativeBalanceLimit: 0,
      balanceBlocked: 89533,
      balanceToRelease: 89527,
      balanceDisponilibity: 106032,
      createdAt: new Date("2024-05-25 21:54:23.475"),
      updatedAt: new Date("2024-06-11 12:35:12.043"),
      deletedAt: null,
      adminId: "f63f34e6-91d1-48f9-b56f-0900181d8fb1",
      isAdmin: false,
    };
    jest
      .spyOn(requestService, "getApprovedWithDrawRequestByAdmin")
      .mockResolvedValueOnce({
        id: "243ea1f6-cc41-4ae0-a1c1-d166a175734c",
        emailUser: "asd@asd.com",
        status: "aproved",
        description: null,
        evaluatorEmail: null,
        typeRequest: "withdraw",
        closed: false,
        valorRequest: 0,
        valorDescount: 0,
        validate: new Date("2024-06-17 11:21:05.175"),
        typeDescount: "thirty",
        createdAt: new Date("2024-06-10 11:21:05.177"),
        updatedAt: new Date("2024-06-26 23:51:37.622"),
        deletedAt: null,
        tax: 0,
        adminId: "f63f34e6-91d1-48f9-b56f-0900181d8fb1",
        userId: "eb16af24-7089-43b8-aacf-abfd68076ff8",
      });
    jest.spyOn(walletService, "update").mockResolvedValueOnce(walletMockUpdate);
    const result = await sut.execute(input);
    const output = {
      data: walletMockUpdate,
    };
    expect(result).toMatchObject(output);
  });
});
