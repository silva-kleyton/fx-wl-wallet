import { IsNotEmpty } from "class-validator";
class EnableOrDisableRequestWhiteListDTO {
  @IsNotEmpty()
  id: string;
}
export { EnableOrDisableRequestWhiteListDTO };
