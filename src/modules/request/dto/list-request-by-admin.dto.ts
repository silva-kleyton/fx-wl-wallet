import { IsNotEmpty } from "class-validator";

class ListRequestByAdminDTO {
  @IsNotEmpty()
  tax_per_installment: number;
}
export { ListRequestByAdminDTO };
