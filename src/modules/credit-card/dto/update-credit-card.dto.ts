import { PartialType } from "@nestjs/mapped-types";
import { CreateCreditCardDto } from "./create-credit-card.dto";
import { IsString } from "class-validator";

export class UpdateCreditCardDto {
  @IsString()
  name: string;
}
