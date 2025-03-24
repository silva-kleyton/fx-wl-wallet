import { IsNotEmpty, IsString } from "class-validator";
class RetrieveTransfeeraCredentialsDto {
  @IsNotEmpty()
  @IsString()
  adminId: string;
}
export { RetrieveTransfeeraCredentialsDto };
