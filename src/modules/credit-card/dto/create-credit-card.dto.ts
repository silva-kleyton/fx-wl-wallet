import { TypeCard } from "@prisma/client";
import { Type } from "class-transformer";
import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Length,
  ValidateNested,
} from "class-validator";

enum TypeGender {
  M = "M",
  F = "F",
}

class Card {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsBoolean()
  virtual: boolean;
}

export class CreateCreditCardDto {
  @IsNotEmpty()
  @Type(() => Card)
  @ValidateNested()
  card: Card;

  // @IsNotEmpty()
  // @IsEmail()
  // email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  surname: string;

  @IsNotEmpty()
  @IsString()
  @Length(10, 11, { message: "cellPhone required 11 caracteres" })
  cellPhone: string;

  @IsNotEmpty()
  @IsEnum(TypeGender)
  gender: TypeGender;

  @IsNotEmpty()
  @IsString()
  @Length(11, 11, { message: "cpf required 11 caracteres" })
  cpf: string;

  @IsNotEmpty()
  @IsString()
  rg: string;

  @IsNotEmpty()
  @IsString()
  nameMother: string;

  @IsNotEmpty({ message: "birthDate is required" })
  @IsDateString()
  birthDate: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 2, { message: "stateBirth required 2 caracteres" })
  stateBirth: string; // estado do nascimento
}
