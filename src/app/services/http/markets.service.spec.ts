import { TestBed } from '@angular/core/testing';

import { MarketsService } from './markets.service';

describe('MarketService', () => {
  let service: MarketsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarketsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
