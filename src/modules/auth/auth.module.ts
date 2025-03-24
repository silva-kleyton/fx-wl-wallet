import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { ApiKeyAuthGuard } from "./guards/api-key.guard";
import { ApiKeyStrategy } from "./strategy/api-key.strategy";

@Module({
  imports: [PassportModule],
  providers: [
    AuthService,
    ApiKeyAuthGuard,
    ApiKeyStrategy,
    //JwtAuthGuard,
    // JwtStrategy,
    // AwsCognitoConfig,
  ],
  exports: [AuthService],
})
export class AuthModule {}
