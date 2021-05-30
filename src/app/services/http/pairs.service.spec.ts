import { TestBed } from '@angular/core/testing';

import { PairsService } from './pairs.service';

describe('PairsService', () => {
  let service: PairsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PairsService);
  });

  xit('should be created', () => {
    expect(service).toBeTruthy();
  });
});
