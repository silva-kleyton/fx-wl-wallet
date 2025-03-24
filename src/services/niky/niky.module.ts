import { Module } from '@nestjs/common';
import { NikyService } from './niky.service';
import { NikyController } from './niky.controller';

@Module({
  controllers: [NikyController],
  providers: [NikyService]
})
export class NikyModule {}
