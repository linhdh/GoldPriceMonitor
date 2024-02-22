import { TestBed } from '@angular/core/testing';

import { BaoTinMinhChauService } from './bao-tin-minh-chau.service';

describe('BaoTinMinhChauService', () => {
  let service: BaoTinMinhChauService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BaoTinMinhChauService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
