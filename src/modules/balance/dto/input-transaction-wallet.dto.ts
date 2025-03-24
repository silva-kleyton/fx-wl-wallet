import {
  EnumRequestStatusAntecipation,
  EnumTypeInput,
  EnumTypeTransaction,
} from "@prisma/client";
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
  Min,
} from "class-validator";
import { ETypeSaleTransaction } from "./create-balance.dto";

export class InputTransactionWalletDto {
  //@IsUUID("4", { message: "userId uuid is invalid" })
  //@IsNotEmpty({ message: "userId is required" })
  @IsOptional()
  readonly userId?: string;

  @IsOptional()
  readonly releaseDays?: number;

  @IsUUID("4", { message: "cardId uuid is invalid" })
  @IsOptional()
  readonly cardId?: string;

  @IsString()
  @IsOptional()
  readonly code?: string;

  @IsUUID("4", { message: "seleId uuid is invalid" })
  @IsOptional()
  readonly saleId?: string;

  @IsUUID("4", { message: "rechargeId uuid is invalid" })
  @IsOptional()
  readonly rechargeId?: string;

  @Type(() => Date)
  @IsNotEmpty({ message: "date is required" })
  @IsDate({ message: "type is Date" })
  readonly date: Date;

  @IsNotEmpty({ message: "typeInput is required" })
  @IsEnum(EnumTypeInput)
  readonly typeInput: EnumTypeInput;

  @IsNotEmpty({ message: "type is required" })
  @IsEnum(EnumTypeTransaction)
  readonly type: EnumTypeTransaction;

  @IsInt({ message: "priceSale is int required" })
  @IsOptional()
  @Min(0, { message: "priceSale not permited negative value" })
  readonly priceSale?: number;

  @IsNotEmpty({ message: "value is required" })
  @IsInt({ message: "value is int required" })
  // @Min(0, { message: "value not permited negative value" })
  readonly value: number;

  @IsNotEmpty({ message: "valueBlocked is required" })
  @IsInt({ message: "valueBlocked is int required" })
  // @Min(0, { message: "valueBlocked not permited negative value" })
  valueBlocked: number;

  @IsNotEmpty({ message: "valueToRelease is required" })
  @IsInt({ message: "valueToRelease is int required" })
  // @Min(0, { message: "valueToRelease not permited negative value" })
  valueToRelease: number;

  @IsNotEmpty({ message: "valueDisponibility is required" })
  @IsInt({ message: "valueDisponibility is int required" })
  // @Min(0, { message: "valueDisponilibity not permited negative value" })
  valueDisponibility: number;

  @IsOptional()
  @IsInt({ message: "valueReserved is int required" })
  valueReserved?: number;

  @IsOptional()
  @IsEnum(ETypeSaleTransaction)
  readonly typeSale?: ETypeSaleTransaction;

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

  @IsOptional()
  @IsString()
  readonly referenceRequireId?: string;

  @IsOptional()
  @IsEnum(EnumRequestStatusAntecipation)
  readonly requestStatusAntecipation?: EnumRequestStatusAntecipation;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  @IsString()
  readonly emailAuditor?: string;

  @Type(() => Date)
  @IsOptional()
  @IsDate({ message: "type is Date" })
  readonly dateUnlock?: Date;

  @Type(() => Date)
  @IsOptional()
  @IsDate({ message: "type is Date" })
  readonly dateUnlockAnticipation?: Date;

  @IsOptional()
  readonly releasedAnticipation?: boolean;

  @IsString({ message: "sellerAdminId is invalid" })
  @IsOptional()
  readonly sellerAdminId?: string;
}
