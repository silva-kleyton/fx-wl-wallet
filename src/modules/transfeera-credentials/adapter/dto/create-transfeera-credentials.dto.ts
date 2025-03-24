import { IsNotEmpty, IsString } from "class-validator";
class TransfeeraCredentialsDTO {
  @IsString()
  @IsNotEmpty()
  clientId: string;
  @IsString()
  @IsNotEmpty()
  clientSecret: string;
  @IsString()
  @IsNotEmpty()
  adminId: string;
}
export { TransfeeraCredentialsDTO };
