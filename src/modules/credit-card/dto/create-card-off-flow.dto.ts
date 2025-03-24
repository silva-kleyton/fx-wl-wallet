import { Type } from "class-transformer";
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateNested,
} from "class-validator";

export class CreateCardOffFlowDto {
  @IsNotEmpty({ message: "Campo email não pode ser vazio" })
  @IsEmail({}, { message: "Informe um email válido" })
  email: string;

  @IsNotEmpty({ message: "Campo nome não pode ser vazio" })
  @IsString({ message: "Campo nome é uma string" })
  name: string;

  @IsNotEmpty({ message: "Campo codeRequest não pode ser vazio" })
  @IsString({ message: "Campo codeRequest é uma string" })
  codeRequest: string;

  @IsNotEmpty({ message: "Campo panVas não pode ser vazio" })
  @IsString({ message: "Campo panVas é uma string" })
  panVas: string;

  @IsNotEmpty({ message: "Campo vitural não pode ser vazios" })
  @IsBoolean({ message: "Campo vitural é um booleano" })
  virtual: boolean;
}
