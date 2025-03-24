import { EnumTypeInput, EnumTypeTransaction } from "@prisma/client";
import { Type } from "class-transformer";
import { IsDate, IsEnum, IsOptional, IsString } from "class-validator";

export class OptionsParamsTransactions {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startAt?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endAt?: Date;

  @IsOptional()
  @IsString()
  @IsEnum(EnumTypeTransaction)
  type?: EnumTypeTransaction;

  @IsOptional()
  @IsString()
  @IsEnum(EnumTypeInput)
  typeInput?: EnumTypeInput;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  balance?: string;
}
