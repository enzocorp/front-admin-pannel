import { TestBed } from '@angular/core/testing';

import { BestsService } from './bests.service';

describe('BestsService', () => {
  let service: BestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BestsService);
  });

  xit('should be created', () => {
    expect(service).toBeTruthy();
  });
});
