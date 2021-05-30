import { TestBed } from '@angular/core/testing';

import { MarketsService } from './markets.service';

describe('MarketService', () => {
  let service: MarketsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarketsService);
  });

  xit('should be created', () => {
    expect(service).toBeTruthy();
  });
});
