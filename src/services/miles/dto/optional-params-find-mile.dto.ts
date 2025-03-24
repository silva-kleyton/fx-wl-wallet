import { EnumStatusMiles } from "@prisma/client";
import { Type } from "class-transformer";
import { IsOptional, IsDate, IsEnum, IsUUID } from "class-validator";

export class OptionalParamsFindMileDto {
  @IsUUID()
  userId: string;  

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startAt?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endAt?: Date;

  @IsOptional()
  @IsEnum(EnumStatusMiles)
  status?: EnumStatusMiles
}
