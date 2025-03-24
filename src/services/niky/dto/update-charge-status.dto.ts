import { IsNumber, IsOptional, IsString } from "class-validator";

enum UpdateChargeStatusEnum  {
    CANCELADO = 'CANCELADO',
    FALHA = 'FALHA',
    PROCESSADO = 'PROCESSADO',
    AGUARDANDO_DESBLOQUEIO = 'AGUARDANDO_DESBLOQUEIO',
    DESCARREGADO = 'DESCARREGADO',
}

export class UpdateChargeStatusDto {
    @IsOptional()
    @IsNumber()
    idItemRecarga: number;

    @IsOptional()
    @IsNumber()
    codigoItemAgencia: number;
    
    @IsOptional()
    @IsString()
    dataStatusItem: string;
    
    @IsOptional()
    @IsString()
    status: UpdateChargeStatusEnum;
}