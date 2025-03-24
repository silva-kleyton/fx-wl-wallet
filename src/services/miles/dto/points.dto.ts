import { IsEmail, IsNumber } from "class-validator";

export class PointsDto {
    @IsEmail()
    userEmail : string;
    @IsNumber()
    value : number;
}
