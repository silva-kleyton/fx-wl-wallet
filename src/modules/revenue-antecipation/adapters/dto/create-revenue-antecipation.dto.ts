import { Request } from "@prisma/client";
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

class CreateRevenueAntecipationDto {
  @IsNotEmpty()
  walletId: string;

  @IsOptional()
  tax_per_installment?: number;

  @IsOptional()
  request?: Request;

  @IsBoolean()
  @IsOptional()
  automatic?: boolean;

  @IsString()
  @IsOptional()
  provider?: string;
}
export { CreateRevenueAntecipationDto };
