import { IsNumber, IsOptional, IsString } from "class-validator";

enum UpdateDischargeStatusEnum  {
    CANCELADO = 'CANCELADO',
    FALHA = 'FALHA',
    PROCESSADO = 'PROCESSADO'
}

export class UpdateDischargeStatusDto {
    @IsOptional()
    @IsNumber()
    idItemDescarga: number;

    @IsOptional()
    @IsNumber()
    codigoItemAgencia: number;
    
    @IsOptional()
    @IsString()
    dataStatusItem: string;
    
    @IsOptional()
    @IsString()
    status: UpdateDischargeStatusEnum;
}