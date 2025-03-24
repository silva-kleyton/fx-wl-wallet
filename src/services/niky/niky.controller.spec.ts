import { Test, TestingModule } from '@nestjs/testing';
import { NikyController } from './niky.controller';
import { NikyService } from './niky.service';

describe('NikyController', () => {
  let controller: NikyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NikyController],
      providers: [NikyService],
    }).compile();

    controller = module.get<NikyController>(NikyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
