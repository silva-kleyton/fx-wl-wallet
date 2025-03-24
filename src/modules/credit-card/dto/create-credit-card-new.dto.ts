import { Type } from "class-transformer";
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from "class-validator";

class Card {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsBoolean()
  virtual: boolean;
}

export class CreateCreditCardNewDto {
  @IsNotEmpty()
  @Type(() => Card)
  @ValidateNested()
  card: Card;
}
