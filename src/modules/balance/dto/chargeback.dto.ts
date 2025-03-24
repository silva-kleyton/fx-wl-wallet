import { EnumTypeInput, EnumTypeTransaction } from "@prisma/client";
import { Type } from "class-transformer";
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsUUID,
  Max,
  Min,
} from "class-validator";

export class ChargebackDto {
  @IsUUID("4", { message: "seleId uuid is invalid" })
  @IsNotEmpty({ message: "sale id is required" })
  readonly saleId: string;

  @Type(() => Date)
  @IsNotEmpty({ message: "date is required" })
  @IsDate({ message: "type is Date" })
  readonly date: Date;

  @IsNotEmpty({ message: "typeInput is required" })
  @IsEnum(EnumTypeInput)
  readonly typeInput: "chargeback";

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

  //   @IsNotEmpty({ message: "valueBlocked is required" })
  //   @IsInt({ message: "valueBlocked is int required" })
  //   // @Min(0, { message: "valueBlocked not permited negative value" })
  //   readonly valueBlocked: number;

  //   @IsNotEmpty({ message: "valueToRelease is required" })
  //   @IsInt({ message: "valueToRelease is int required" })
  //   // @Min(0, { message: "valueToRelease not permited negative value" })
  //   readonly valueToRelease: number;

  @IsNotEmpty({ message: "valueDisponilibity is required" })
  @IsInt({ message: "valueDisponilibity is int required" })
  @Max(0, { message: "valueDisponilibity not permited positive value" })
  readonly valueDisponilibity: number;
}
