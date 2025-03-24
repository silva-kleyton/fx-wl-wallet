import { Module } from "@nestjs/common";
import { CoreService } from "./core.service";
import { HttpModule } from "@nestjs/axios";

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
  providers: [CoreService],
})
export class CoreModule {}