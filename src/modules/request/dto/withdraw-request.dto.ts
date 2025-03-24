import { IsEmail, IsNumber, IsString, IsOptional } from "class-validator";

export class WithdrawRequestDto {
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsNumber()
  tax?: number;

  @IsString()
  @IsEmail()
  emailUser: string;

  @IsString()
  bankAccountId: string;
}
