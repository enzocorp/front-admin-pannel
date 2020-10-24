import { TestBed } from '@angular/core/testing';

import { ExclusionService } from './exclusion.service';

describe('ExclusionService', () => {
  let service: ExclusionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExclusionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
