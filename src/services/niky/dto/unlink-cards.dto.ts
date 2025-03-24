import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";

class Desvinculacoes {
    @IsNotEmpty({ message: 'codigoItemAgencia is required' })
    @IsNumber()
    codigoItemAgencia: number;

    @IsString({ message: 'descricaoItemAgencia is required' })
    descricaoItemAgencia: string;

    @IsNotEmpty({ message: 'codigoCartao is required' })
    @IsString({ message: 'codigoCartao is required' })
    codigoCartao: number;
    
    @IsNotEmpty({ message: 'cpf is required' })
    @IsString({ message: 'cpf is required' })
    cpf: string;
}
export class UnlinkCardsDto {
    @IsNotEmpty({ message: 'tipoOperacao is required' })
    @IsNumber()
    tipoOperacao: number;

    @IsNotEmpty({ message: 'idAgencia is required' })
    @IsString({ message: 'idAgencia is required' })
    idAgencia: string;

    @IsNotEmpty({ message: 'dataExecucao is required' })
    @IsString({ message: 'dataExecucao is required' })
    dataExecucao: string;

    @IsNotEmpty({ message: 'codigoLoteAgencia is required' })
    @IsString({ message: 'codigoLoteAgencia is required' })
    codigoLoteAgencia: string;

    @IsNotEmpty({ message: 'descricaoLoteAgencia is required' })
    @IsString({ message: 'descricaoLoteAgencia is required' })
    descricaoLoteAgencia: string;

    @IsNotEmpty({ message: 'quantidadeTotal is required' })
    @IsNumber()
    quantidadeTotal: number;
    
    @ValidateNested()
    @Type(() => Desvinculacoes)
    desvinculacoes: Desvinculacoes[];
}