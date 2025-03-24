import { IsNotEmpty, IsString } from "class-validator";
class DeleteTransfeeraCredentialsDto {
  @IsNotEmpty()
  @IsString()
  adminId: string;
}
export { DeleteTransfeeraCredentialsDto };
