import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SendQueueBackofficeDto {
  @IsNotEmpty({
    message: '"request id" is required',
  })
  @IsString({
    message: "request id has be string",
  })
  requestId: string;

  @IsNotEmpty({
    message: "authorized is required",
  })
  @IsBoolean({
    message: "authorized has be boolean",
  })
  authorized: boolean;

  @IsNotEmpty({
    message: "email auditor is required",
  })
  @IsString({
    message: "email auditor has be string",
  })
  emailAuditor: string;

  @IsNotEmpty({
    message: "description is required",
  })
  @IsString({
    message: "description has be string",
  })
  description: string;

  @IsOptional()
  userId?: string;
}