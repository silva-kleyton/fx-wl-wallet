import { IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateWalletDto {
  @IsString()
  userId: string;

  @IsBoolean()
  isAdmin: boolean;

  @IsString()
  @IsOptional()
  adminId?: string;
}
