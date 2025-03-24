import { EnumTypeInput, EnumTypeTransaction } from "@prisma/client";
import { Type } from "class-transformer";
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsUUID,
  Max
} from "class-validator";

export class RechargeCardDto {
  @IsUUID("4", { message: "cardId uuid is invalid" })
  @IsNotEmpty({ message: "cardId is required" })
  readonly cardId: string;

  @Type(() => Date)
  @IsNotEmpty({ message: "date is required" })
  @IsDate({ message: "type is Date" })
  readonly date: Date;

  @IsNotEmpty({ message: "typeInput is required" })
  @IsEnum(EnumTypeInput)
  readonly typeInput: "rechargeCard";

  @IsNotEmpty({ message: "type is required" })
  @IsEnum(EnumTypeTransaction)
  readonly type: "debit";

  @IsNotEmpty({ message: "value is required" })
  @IsInt({ message: "value is int required" })
  @Max(Number(process.env.TAX_RECHARGE_CARD), {
    message: `value not allowed, min value service fee ${process.env.TAX_RECHARGE_CARD}`,
  })
  readonly value: number;

  @IsNotEmpty({ message: "valueDisponilibity is required" })
  @IsInt({ message: "valueDisponilibity is int required" })
  //@Max(0, { message: "valueDisponilibity not permited positive value" })
  readonly valueDisponibility: number;
}
