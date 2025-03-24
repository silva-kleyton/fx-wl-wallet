import { IsInt, IsNegative, IsNotEmpty, IsString, Max } from "class-validator";

export class DischargeCardRequestDto {
  @IsString({ message: "cardId uuid is invalid" })
  @IsNotEmpty({ message: "cardId is required" })
  readonly cardId: string;

  @IsNotEmpty({ message: "value is required" })
  @IsInt({ message: "value is int required" })
  @IsNegative({ message: "value not permited positive value" })
  @Max(0, { message: "value not permited positive value" })
  readonly value: number;
}
