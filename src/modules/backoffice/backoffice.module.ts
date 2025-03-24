import { Module } from "@nestjs/common";
import { BackofficeService } from "./backoffice.service";
import { BackofficeController } from "./backoffice.controller";
import { PrismaService } from "../../prisma/prisma.service";
import { CoreService } from "../../services/core/core.service";
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
  controllers: [BackofficeController],
  providers: [BackofficeService, PrismaService, CoreService],
})
export class BackofficeModule {}
