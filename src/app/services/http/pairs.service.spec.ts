import { TestBed } from '@angular/core/testing';

import { PairsService } from './pairs.service';

describe('PairsService', () => {
  let service: PairsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PairsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
