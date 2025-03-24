import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { HeaderAPIKeyStrategy } from "passport-headerapikey";
import { AuthService } from "../auth.service";

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(
  HeaderAPIKeyStrategy,
  "api-key",
) {
  constructor(private authService: AuthService) {
    super({ header: "api-key", prefix: "" }, true, (apikey, done) => {
      const checkKey = this.authService.validateApiKey(apikey);

      if (!checkKey) {
        return done(new UnauthorizedException(), null);
      }

      return done(null, true);
    });
  }
}
