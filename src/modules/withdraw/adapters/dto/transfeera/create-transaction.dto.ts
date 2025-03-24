import { IsNumber, IsOptional, IsString } from "class-validator";

type DestinationBankAccount = {
  companyDocument: string;
  companyName: string;
  pixKey: string;
  pixKeyType: string;
  agencyNumber: string;
  accountNumber: string;
  accountDigit: string;
  accountType: "corrente" | "poupanca" | "pagamento";
};
type PixKeyValidation = {
  cpf_cnpj: string;
};
class CreateTransferDTO {
  @IsOptional()
  @IsNumber()
  value: number;
  @IsOptional()
  @IsNumber()
  tax: number;
  @IsOptional()
  @IsString()
  pix_description: string;
  @IsOptional()
  destination_bank_account: DestinationBankAccount;
  @IsOptional()
  pix_key_validation: PixKeyValidation;
  @IsOptional()
  @IsString()
  walletId: string;

  @IsOptional()
  @IsString()
  provider: string;

  @IsOptional()
  @IsString()
  requestId: string;
}

export { CreateTransferDTO };
