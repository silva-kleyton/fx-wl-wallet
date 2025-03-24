import { EnumTypeInput, EnumTypeTransaction } from "@prisma/client";
import { Type } from "class-transformer";
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsUUID,
  Min,
} from "class-validator";

export class DischargeCardDto {
  @IsUUID("4", { message: "cardId uuid is invalid" })
  @IsNotEmpty({ message: "cardId is required" })
  readonly cardId: string;

  @Type(() => Date)
  @IsNotEmpty({ message: "date is required" })
  @IsDate({ message: "type is Date" })
  readonly date: Date;

  @IsNotEmpty({ message: "typeInput is required" })
  @IsEnum(EnumTypeInput)
  readonly typeInput: "dischargeCard";

  @IsNotEmpty({ message: "type is required" })
  @IsEnum(EnumTypeTransaction)
  readonly type: "credit";

  @IsNotEmpty({ message: "value is required" })
  @IsInt({ message: "value is int required" })
  @Min(Number(process.env.TAX_RECHARGE_CARD), {
    message: `value not allowed, min value service fee  ${process.env.TAX_RECHARGE_CARD}`,
  })
  readonly value: number;

  @IsNotEmpty({ message: "valueDisponilibity is required" })
  @IsInt({ message: "valueDisponilibity is int required" })
  @Min(0, { message: "valueDisponilibity not permited negative value" })
  readonly valueDisponibility: number;
}
