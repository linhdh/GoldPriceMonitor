import { TestBed } from '@angular/core/testing';

import { SjcService } from './sjc.service';

describe('SjcService', () => {
  let service: SjcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SjcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
