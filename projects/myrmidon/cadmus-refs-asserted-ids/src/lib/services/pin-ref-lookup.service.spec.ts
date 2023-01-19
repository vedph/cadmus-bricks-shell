import { TestBed } from '@angular/core/testing';

import { PinRefLookupService } from './pin-ref-lookup.service';

describe('PinRefLookupService', () => {
  let service: PinRefLookupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PinRefLookupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
