import { Test, TestingModule } from '@nestjs/testing';
import { NikyService } from './niky.service';

describe('NikyService', () => {
  let service: NikyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NikyService],
    }).compile();

    service = module.get<NikyService>(NikyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
