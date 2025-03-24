import { EnumTypeInput, EnumTypeTransaction } from "@prisma/client";
import { Type } from "class-transformer";
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from "class-validator";

export enum ETypeSaleTransaction {
  creditCard = "creditCard",
  bankBillet = "bankBillet",
  pix = "pix",
}

export class CreateBalanceDto {
  @IsUUID("4", { message: "userId uuid is invalid" })
  @IsNotEmpty({ message: "userId is required" })
  readonly userId: string;

  @IsUUID("4", { message: "seleId uuid is invalid" })
  @IsNotEmpty({ message: "seleId is required" })
  readonly saleId: string;

  @IsNotEmpty({ message: "typeInput is required" })
  @IsEnum(EnumTypeInput)
  readonly typeInput: EnumTypeInput;

  @IsNotEmpty({ message: "type is required" })
  @IsEnum(EnumTypeTransaction)
  readonly type: EnumTypeTransaction;

  @IsNotEmpty({ message: "typeSale is required" })
  @IsEnum(ETypeSaleTransaction)
  readonly typeSale: ETypeSaleTransaction;

  @IsInt({ message: "priceSale is int required" })
  @IsNotEmpty({ message: "priceSale is required" })
  @IsPositive({ message: "priceSale is positive value" })
  readonly priceSale: number;

  @IsNotEmpty({ message: "value is required" })
  @IsInt({ message: "value is int required" })
  @IsPositive({ message: "value is positive value" })
  readonly value: number;

  @Type(() => Date)
  @IsNotEmpty({ message: "date is required" })
  @IsDate({ message: "type is Date" })
  readonly date: Date;

  @IsOptional()
  @IsInt({ message: "installments is int required" })
  @IsPositive({ message: "installments is positive value" })
  readonly installments?: number;

  @IsOptional()
  @IsNumber()
  readonly percentageComission?: number;

  @IsOptional()
  @IsString()
  readonly referenceComissionSale?: string;
}
