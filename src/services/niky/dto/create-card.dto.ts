import { Type } from "class-transformer";
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  ValidateNested,
} from "class-validator";

class Produto {
  @IsNotEmpty()
  @IsString()
  codigoProduto: "H360BN001";

  @IsNotEmpty()
  @IsBoolean()
  cartaoVirtual: boolean;
}

class Portador {
  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsNotEmpty()
  @IsString()
  cpf: string;

  @IsNotEmpty()
  @IsString()
  celularContato: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  emailContato: string;

  @IsNotEmpty()
  @IsString()
  dataNascimento: string;

  @IsNotEmpty()
  @IsString()
  nomeMae: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 2, { message: "Precisa possuir 2 caracteres" })
  codigoAreaCelular: string; // max 2

  @IsNotEmpty()
  @IsString()
  @Length(10, 11, { message: "numeroCelular requer 11 caracteres" })
  numeroCelular: string;
}

class Cartao {
  @IsNotEmpty()
  @Type(() => Produto)
  @ValidateNested()
  produto: Produto;

  @IsNotEmpty()
  @Type(() => Portador)
  @ValidateNested()
  portador: Portador;
}

class Item {
  @IsNotEmpty()
  @IsInt()
  codigoItemAgencia: number;

  @Type(() => Cartao)
  @ValidateNested()
  cartao: Cartao;
}

export class CreateCardNikyDto {
  @IsNotEmpty()
  @IsString()
  idAgencia: string;

  @IsNotEmpty()
  @IsString()
  @IsDateString()
  dataExecucao: string;

  @IsNotEmpty()
  @IsInt()
  quantidadeTotal: number;

  @IsNotEmpty()
  @Type(() => Item)
  @ValidateNested({ each: true })
  itens: Item[];
}
