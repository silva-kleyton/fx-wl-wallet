import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from "class-validator";

export class PreChargebackAlertDto {
  @IsOptional()
  @IsString()
  readonly code?: string;

  @IsInt({ message: "priceSale is int required" })
  @IsNotEmpty({ message: "priceSale is required" })
  @IsPositive({ message: "priceSale is positive value" })
  readonly priceSale: number;

  @IsNotEmpty({ message: "value is required" })
  @IsInt({ message: "value is int required" })
  @IsPositive({ message: "value is positive value" })
  readonly value: number;

  @IsNotEmpty({ message: "valueDisponibility is required" })
  @IsInt({ message: "valueDisponibility is int required" })
  readonly valueDisponibility: number;
}
