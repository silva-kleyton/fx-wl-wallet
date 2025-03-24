import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { CoreService } from "../../services/core/core.service";
import { NikyService } from "../../services/niky/niky.service";
import { CreditCardController } from "./credit-card.controller";
import { CreditCardService } from "./credit-card.service";
import { FindAllCardByUserService } from "./use-cases/find-all-card-by-user.service";

@Module({
  imports: [
    HttpModule.register({
      baseURL: `${process.env.BASE_URL_CORE}`,
      headers: {
        "Content-Type": "application/json",
        "api-key": `${process.env.API_KEY_CORE}`,
      },
    }),
  ],
  controllers: [CreditCardController],
  providers: [
    CreditCardService,
    FindAllCardByUserService,
    NikyService,
    CoreService,
  ],
})
export class CreditCardModule {}
