import { IsEnum, IsOptional } from "class-validator";
import { CardStatus } from "../use-cases/find-all-card-by-user.service";

export class FindAllCardByUserFiltersDto {
  @IsEnum(CardStatus)
  @IsOptional()
  readonly cardStatus: CardStatus;
}
