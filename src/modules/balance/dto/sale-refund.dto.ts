import { EnumTypeInput, EnumTypeTransaction } from "@prisma/client";
import { Type } from "class-transformer";
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from "class-validator";

export class SaleRefundDto {
  @IsUUID("4", { message: "seleId uuid is invalid" })
  @IsNotEmpty({ message: "sale id is required" })
  readonly saleId: string;

  @Type(() => Date)
  @IsNotEmpty({ message: "date is required" })
  @IsDate({ message: "type is Date" })
  readonly date: Date;

  @IsNotEmpty({ message: "typeInput is required" })
  @IsEnum(EnumTypeInput)
  readonly typeInput: "saleRefund";

  @IsNotEmpty({ message: "type is required" })
  @IsEnum(EnumTypeTransaction)
  readonly type: "debit";

  @IsInt({ message: "priceSale is int required" })
  @IsNotEmpty({ message: "priceSale is required" })
  @Min(0, { message: "priceSale not permited negative value" })
  readonly priceSale: number;

  @IsNotEmpty({ message: "value is required" })
  @IsInt({ message: "value is int required" })
  @Max(0, { message: "value not permited positive value" })
  readonly value: number;

  @IsNotEmpty({ message: "valueDisponibility is required" })
  @IsInt({ message: "valueDisponibility is int required" })
  @Max(0, { message: "valueDisponibility not permited positive value" })
  readonly valueDisponibility: number;

  @IsBoolean()
  @IsOptional()
  readonly chargeFromReceivable?: boolean;

  @IsBoolean()
  @IsOptional()
  readonly chargeFromReserve?: boolean;
}
