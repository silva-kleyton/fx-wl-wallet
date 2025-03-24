import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { CreateRevenueAntecipationDto } from "../../../modules/revenue-antecipation/adapters/dto/create-revenue-antecipation.dto";
class ApprovedRequestDTO {
  @IsNotEmpty()
  @IsString()
  requestId: string;

  @IsNotEmpty()
  antecipation: CreateRevenueAntecipationDto;

  @IsBoolean()
  @IsOptional()
  automatic?: boolean;

  @IsString()
  @IsOptional()
  provider?: string;
}

class ApprovedWithDrawnRequestDTO {
  @IsBoolean()
  @IsOptional()
  automatic?: boolean;
}
export { ApprovedRequestDTO, ApprovedWithDrawnRequestDTO };
