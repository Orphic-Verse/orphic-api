import { Test, TestingModule } from '@nestjs/testing';
import { VisitHistoryService } from './visit-history.service';

describe('VisitHistoryService', () => {
  let service: VisitHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VisitHistoryService],
    }).compile();

    service = module.get<VisitHistoryService>(VisitHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
