import { Type } from "class-transformer";
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from "class-validator";

class Recargas {
  @IsNotEmpty({ message: "codigoItemAgencia is required" })
  @IsNumber()
  codigoItemAgencia: number;

  @IsString({ message: "descricaoItemAgencia is required" })
  descricaoItemAgencia: string;

  @IsNotEmpty({ message: "cartaoDestinatario is required" })
  @IsString({ message: "cartaoDestinatario is required" })
  cartaoDestinatario: string;

  @IsNotEmpty({ message: "cpfDestinatario is required" })
  @IsString({ message: "cpfDestinatario is required" })
  cpfDestinatario: string;

  @IsNotEmpty({ message: "valorRecarga is required" })
  @IsNumber()
  valorRecarga: number;
}
export class CreateRechargeDto {
  @IsNotEmpty({ message: "idAgencia is required" })
  @IsString({ message: "idAgencia is required" })
  idAgencia: string;

  @IsNotEmpty({ message: "dataExecucao is required" })
  @IsString({ message: "dataExecucao is required" })
  dataExecucao: string;

  @IsNotEmpty({ message: "codigoLoteAgencia is required" })
  @IsString({ message: "codigoLoteAgencia is required" })
  codigoLoteAgencia: string;

  @IsNotEmpty({ message: "descricaoLoteAgencia is required" })
  @IsString({ message: "descricaoLoteAgencia is required" })
  descricaoLoteAgencia: string;

  @IsNotEmpty({ message: "valorTotal is required" })
  @IsNumber()
  valorTotal: number;

  @IsNotEmpty({ message: "quantidadeTotal is required" })
  @IsNumber()
  quantidadeTotal: number;

  @ValidateNested()
  @Type(() => Recargas)
  recargas: Recargas[];
}
