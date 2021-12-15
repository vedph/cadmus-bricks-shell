import { TestBed } from '@angular/core/testing';

import { ViafRefLookupService } from './viaf-ref-lookup.service';

describe('ViafRefLookupService', () => {
  let service: ViafRefLookupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViafRefLookupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
