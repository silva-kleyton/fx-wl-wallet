import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AwsCognitoConfig {
  constructor(private readonly configService: ConfigService) {}

  public readonly userPoolId: string =
    this.configService.get<string>("USER_POOL_ID");

  public readonly clientId: string =
    this.configService.get<string>("CLIENT_ID_COGNITO");

  public readonly region: string =
    this.configService.get<string>("AWS_REGION_APP");

  public readonly authority: string = `https://cognito-idp.${this.region}.amazonaws.com/${this.userPoolId}`;
}
