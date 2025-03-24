import { EnumTypeTransaction } from "@prisma/client";
import {
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from "class-validator";

export type ValuesToManualTransaction = "valueDisponibility" | "valueReserved";

class CreateManualTransactionDTO {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsIn(["valueDisponibility", "valueReserved"])
  sourceBalance: ValuesToManualTransaction;

  @IsNotEmpty()
  @IsNumber()
  value: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsEnum(EnumTypeTransaction)
  type: EnumTypeTransaction;

  @ValidateIf((object) => object.type === EnumTypeTransaction.movement)
  @IsIn(["valueDisponibility", "valueReserved"])
  destinyBalance?: ValuesToManualTransaction;
}

export { CreateManualTransactionDTO };
