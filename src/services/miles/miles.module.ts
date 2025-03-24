import { Module } from '@nestjs/common';
import { MilesService } from './miles.service';
import { MilesController } from './miles.controller';
import { CoreService } from '../core/core.service';
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
  controllers: [MilesController],
  providers: [MilesService, CoreService]
})
export class MilesModule {}
