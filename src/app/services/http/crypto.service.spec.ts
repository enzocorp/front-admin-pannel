import { TestBed } from '@angular/core/testing';

import { CryptoService } from './crypto.service';

describe('GetCryptoService', () => {
  let service: CryptoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CryptoService);
  });

  xit('should be created', () => {
    expect(service).toBeTruthy();
  });
});
