import { IsIn, IsNotEmpty } from "class-validator";

class CreateRequestWhiteListDTO {
  @IsNotEmpty()
  walletId: string;
  @IsNotEmpty()
  @IsIn(["antecipation", "withdraw"])
  typeRequest: "antecipation" | "withdraw";
  @IsNotEmpty()
  isActive: boolean;
  @IsNotEmpty()
  adminId: string;
}
export { CreateRequestWhiteListDTO };
