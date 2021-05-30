import { TestBed } from '@angular/core/testing';

import { AssetsService } from './assets.service';

describe('AssetsService', () => {
  let service: AssetsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetsService);
  });

  xit('should be created', () => {
    expect(service).toBeTruthy();
  });
});
