import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class WithdrawRequestBodyDto {
  @IsString()
  @IsNotEmpty()
  requestId: string;

  @IsNumber()
  amount: number;
}
