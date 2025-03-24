import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { passportJwtSecret } from "jwks-rsa";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AwsCognitoConfig } from "../cognito.config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(private awsCognitoConfig: AwsCognitoConfig) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      audience: awsCognitoConfig.clientId,
      issuer: awsCognitoConfig.authority,
      algorithm: ["RS256"],
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${awsCognitoConfig.authority}/.well-known/jwks.json`,
      }),
    });
  }

  async validate(payload: any) {
    const { sub, email, "cognito:username": username } = payload;
    return { id: sub, username, email };
  }
}
