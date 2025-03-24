import { Type } from "class-transformer";
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from "class-validator";

class AccountData {
  @IsString()
  @IsNotEmpty()
  nameBank: string;

  @IsString()
  @IsNotEmpty()
  agency: string;

  @IsString()
  @IsNotEmpty()
  account: string;
}

export enum SelectDays {
  fourteen = 15,
  thirty = 30,
}

export class RequestAntecipationDto {
  @IsEnum(SelectDays)
  @IsNotEmpty()
  selectDays: SelectDays;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  document: string;

  //   @IsInt()
  //   @IsNotEmpty()
  //   @IsPositive()
  //   balanceAvailable: number; // saldo disponivel

  //   @IsInt()
  //   @IsNotEmpty()
  //   // @IsPositive()
  //   balanceToRelease: number; // saldo a liberar

  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  valueRequest: number; // valor requisitado

  @IsString()
  @IsOptional()
  pix?: string;

  @IsString()
  @IsOptional()
  typePix?: string;

  @Type(() => AccountData)
  @ValidateNested()
  account?: AccountData;
}
