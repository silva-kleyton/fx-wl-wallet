import { IsNotEmpty, IsString } from "class-validator";
class GetVolutiCredentialsDto {
  @IsNotEmpty()
  @IsString()
  adminId: string;
}
export { GetVolutiCredentialsDto };
