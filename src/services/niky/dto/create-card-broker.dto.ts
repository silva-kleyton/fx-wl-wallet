import { Type } from "class-transformer";
import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty, IsOptional,
  IsString,
  Length,
  ValidateNested
} from "class-validator";

enum Gender {
  M = "M",
  F = "F",
}

class NationResidence {
  @IsNotEmpty()
  @IsString()
  nameNation: string; // BRASIL
}

class MunicipalityResidence {
  @IsNotEmpty()
  @IsString()
  progProvinciaId: string; // Estado - MG

  @IsNotEmpty()
  @IsString()
  nameComune: string; // cidade

  @IsNotEmpty()
  @IsString()
  nameProvincia: string; // Estado - MG
}

class NationBirth {
  @IsNotEmpty()
  @IsString()
  nameNation: "Brasil";
}

class CustomerDetailBean {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  surname: string;

  @IsNotEmpty()
  @IsString()
  nameMother: string;

  @IsNotEmpty()
  @IsString()
  flagSex: string; // M ou F

  @IsNotEmpty()
  @IsString()
  taxCode: string; // cpf

  @IsNotEmpty()
  @IsString()
  flagNationality: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  mobile: string; // telefone celular

  @IsNotEmpty()
  @IsDateString()
  dateBirth: string; // data de nascimento

  @IsNotEmpty()
  @Type(() => NationBirth)
  nationBirth: NationBirth;

  @IsNotEmpty()
  @IsString()
  foreignBirthLocation: string;

  @IsNotEmpty()
  @IsString()
  address: string; // rua

  @IsNotEmpty()
  @IsString()
  streetNumber: string; // número da rua

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => MunicipalityResidence)
  municipalityResidence: MunicipalityResidence;

  @IsNotEmpty()
  @IsString()
  @Length(8, 8, { message: `cep inválido` })
  cap: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => NationResidence)
  nationResidence: NationResidence;

  @IsNotEmpty()
  @IsString()
  district: string; // bairro

  @IsNotEmpty()
  @IsString()
  complemento: string; // complemento
}

class CustomerDocumentBean {
  @IsNotEmpty()
  @IsString()
  codeDocument: string; // RG

  documentType: {
    code: "RGE";
  };
}

class AdeguataVerificaPersonaFisica {
  @IsNotEmpty()
  @IsString()
  politicamenteEsposta: string; // "false"

  @IsNotEmpty()
  @IsString()
  fasciaReddito: string; // "4500"

  // @IsNotEmpty()
  // @IsBoolean()
  // nuovoCliente: true;

  // @IsNotEmpty()
  // @IsBoolean()
  // relationAlreaydExist: false;
}

class Applicant {
  @IsNotEmpty()
  @IsBoolean()
  newCustomer: true;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CustomerDetailBean)
  customerDetailBean: CustomerDetailBean;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CustomerDocumentBean)
  customerDocumentBean: CustomerDocumentBean;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AdeguataVerificaPersonaFisica)
  adeguataVerificaPersonaFisica: AdeguataVerificaPersonaFisica;

  @IsNotEmpty()
  @IsString()
  roleType: "TITOLARE_RAPPORTO";

  @IsNotEmpty()
  @IsBoolean()
  flagOmocodia: false; // sempre false
}

class RequestRelation {
  @IsNotEmpty()
  @IsString()
  codeCobrander: string;

  @IsOptional()
  @IsString()
  fourthLine?: string;

  @IsNotEmpty()
  @IsString()
  codeProduct: string;

  @IsNotEmpty()
  @IsString()
  codeCardCategory: string;

  @IsNotEmpty()
  @IsBoolean()
  virtual: boolean;
}

class Content {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => RequestRelation)
  requestRelation: RequestRelation;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Applicant)
  applicant: Applicant;

  @IsNotEmpty()
  @IsString()
  mobilePhoneContact: string; // número telefone

  @IsNotEmpty()
  @IsEmail()
  emailContact: string;

  @IsNotEmpty()
  @IsDateString()
  dateRequest: Date;

  @IsNotEmpty()
  @IsString()
  tradePurpose: "true";

  @IsNotEmpty()
  @IsString()
  isGenerateBoleto: "false";

  @IsNotEmpty()
  @IsString()
  isSendNotify: "false";

  @IsNotEmpty()
  @IsBoolean()
  cardIssuing: boolean;
}

export class CreateCardBrokerDto {
  @IsNotEmpty()
  @IsString()
  tokenCode: string; // token de autenticação

  @ValidateNested()
  @Type(() => Content)
  content: Content;
}