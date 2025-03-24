import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./modules/auth/auth.module";
import { BackofficeModule } from "./modules/backoffice/backoffice.module";
import { BalanceModule } from "./modules/balance/balance.module";
import { CreditCardModule } from "./modules/credit-card/credit-card.module";
import { RequestWhiteListModule } from "./modules/request-white-list/request-white-list.module";
import { RequestModule } from "./modules/request/request.module";
import { RevenueAntecipationModule } from "./modules/revenue-antecipation/revenue-antecipation.module";
import { TransactionsModule } from "./modules/transactions/transactions.module";
import { TransfeeraCredentialsModule } from "./modules/transfeera-credentials/transfeera-credentials.module";
import { WalletModule } from "./modules/wallet/wallet.module";
import { WithDrawModule } from "./modules/withdraw/withdraw.module";
import { PrismaModule } from "./prisma/prisma.module";
import { CoreModule } from "./services/core/core.module";
import { MilesModule } from "./services/miles/miles.module";
import { NikyModule } from "./services/niky/niky.module";
import { VolutiCredentialsModule } from "./modules/voluti-credentials/voluti-credentials.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    WalletModule,
    RequestModule,
    BalanceModule,
    BackofficeModule,
    TransactionsModule,
    CoreModule,
    NikyModule,
    CreditCardModule,
    MilesModule,
    RevenueAntecipationModule,
    RequestWhiteListModule,
    WithDrawModule,
    TransfeeraCredentialsModule,
    VolutiCredentialsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(AuthApiKeyMiddleware).forRoutes("");
  // }
}
