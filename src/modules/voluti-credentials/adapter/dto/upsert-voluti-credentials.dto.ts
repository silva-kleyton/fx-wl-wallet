import { IsNotEmpty, IsString } from "class-validator";
class VolutiCredentialsDTO {
  @IsString()
  @IsNotEmpty()
  clientId: string;
  @IsString()
  @IsNotEmpty()
  clientSecret: string;
  @IsString()
  @IsNotEmpty()
  certificateCrt: string;
  @IsString()
  @IsNotEmpty()
  certificateKey: string;
  @IsString()
  @IsNotEmpty()
  certificatePfx: string;
  @IsString()
  @IsNotEmpty()
  pfxPassword: string;
  @IsString()
  @IsNotEmpty()
  adminId: string;
}
export { VolutiCredentialsDTO };
