import { IsNotEmpty, IsUUID } from "class-validator";

export class ConfirmedAntecipationDto {
  @IsNotEmpty({ message: "requestId is required" })
  @IsUUID("4", { message: "request id has be uuidv4" })
  requestId: string;

  @IsNotEmpty({ message: "userId is required" })
  @IsUUID("4", { message: "userId id has be uuidv4" })
  userId: string;
}
