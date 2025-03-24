import { EnumTypeInput, EnumTypeTransaction } from "@prisma/client";
import { Type } from "class-transformer";
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsUUID,
  Min
} from "class-validator";

export class RechargeDto {
  @IsUUID("4", { message: "rechargeId uuid is invalid" })
  @IsNotEmpty({ message: "rechargeId is required" })
  readonly rechargeId: string;

  @Type(() => Date)
  @IsNotEmpty({ message: "date is required" })
  @IsDate({ message: "type is Date" })
  readonly date: Date;

  @IsNotEmpty({ message: "typeInput is required" })
  @IsEnum(EnumTypeInput)
  readonly typeInput: "recharge";

  @IsNotEmpty({ message: "type is required" })
  @IsEnum(EnumTypeTransaction)
  readonly type: "deposit";

  @IsNotEmpty({ message: "value is required" })
  @IsInt({ message: "value is int required" })
  @Min(0, { message: "value not permited negative value" })
  readonly value: number;

  @IsNotEmpty({ message: "valueDisponilibity is required" })
  @IsInt({ message: "valueDisponilibity is int required" })
  //@Min(0, { message: "valueDisponilibity not permited negative value" })
  readonly valueDisponibility: number;
}
