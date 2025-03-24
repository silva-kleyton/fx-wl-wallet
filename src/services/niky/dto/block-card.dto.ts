import { IsNotEmpty, IsString } from "class-validator";

enum MotivoBloqueioEnum {
    PERDA = 'PERDA',
    ROUBO = 'ROUBO',
    DEFEITO = 'DEFEITO'
}

export class BlockCardDto {
    @IsNotEmpty()
    @IsString({ message: 'motivoBloqueio is string' })
    motivoBloqueio: MotivoBloqueioEnum;
}