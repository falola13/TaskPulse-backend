import { Test, TestingModule } from '@nestjs/testing';
import { 2FaService } from './2-fa.service';

describe('2FaService', () => {
  let service: 2FaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [2FaService],
    }).compile();

    service = module.get<2FaService>(2FaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
