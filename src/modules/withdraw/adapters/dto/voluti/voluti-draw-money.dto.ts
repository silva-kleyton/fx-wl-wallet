export type WithdrawMoneyInput = {
  adminId: string;
  idempotencyKey: string;
  body: BodyInput;
};

type BodyInput = {
  pixKey: string;
  creditorDocument?: string;
  priority: "NORM" | "HIGH";
  payment: {
    amount: number;
    currency: string;
  };
};

export type WithdrawMoneyOutput = {
  id: number;
  refunds: any[];
  idempotencyKey: string;
  endToEndId: string;
  pixKey: string;
  payment: {
    currency: string;
    amount: number;
  };
  status: string;
  transactionType: string;
  localInstrument: string;
  createdAt: string;
  creditorAccount: AccountDetails;
  debtorAccount: AccountDetails;
  remittanceInformation: string | null;
  errorCode: string | null;
  txId: string | null;
  creditDebitType: string;
};

type AccountDetails = {
  ispb: string;
  document: string;
  name: string;
  number: string;
  issuer: string;
  accountType: string;
};
