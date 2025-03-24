import { IsOptional, IsString } from "class-validator";

export class UpdateBearerDataDto {
    @IsOptional()
    @IsString({ message: 'codigoAreaCelular is string' })
    codigoAreaCelular: string; 
    
    @IsOptional()
    @IsString({ message: 'numeroCelular is string' })
    numeroCelular: string; 

    @IsOptional()
    @IsString({ message: 'email is string' })
    email: string; 

    @IsOptional()
    @IsString({ message: 'logradouro is string' })
    logradouro: string; 

    @IsOptional()
    @IsString({ message: 'numeroLogradouro is string' })
    numeroLogradouro: string; 

    @IsOptional()
    @IsString({ message: 'complementoLogradouro is string' })
    complementoLogradouro: string;
    
    @IsOptional()
    @IsString({ message: 'bairro is string' })
    bairro: string; 

    @IsOptional()
    @IsString({ message: 'cidade is string' })
    cidade: string; 

    @IsOptional()
    @IsString({ message: 'codigoCidadeIbge is string' })
    codigoCidadeIbge: string; 

    @IsOptional()
    @IsString({ message: 'estado is string' })
    estado: string; 

    @IsOptional()
    @IsString({ message: 'codigoEstadoIbge is string' })
    cep: string; 
}