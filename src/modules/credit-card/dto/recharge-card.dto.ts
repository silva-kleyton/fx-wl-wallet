import { IsInt, IsNotEmpty, IsString, Min } from "class-validator";

export class RechargeCardDto {
  @IsNotEmpty({ message: "cardId is required" })
  @IsString({ message: "cardId invalid" })
  cardId: string;

  @IsNotEmpty({ message: "value is required" })
  @IsInt({ message: "value require integer" })
  @Min(0, { message: "value not permited negative value" })
  value: number;
}
