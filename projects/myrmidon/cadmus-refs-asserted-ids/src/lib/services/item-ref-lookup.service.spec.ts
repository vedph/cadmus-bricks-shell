import { TestBed } from '@angular/core/testing';

import { ItemRefLookupService } from './item-ref-lookup.service';

describe('ItemRefLookupService', () => {
  let service: ItemRefLookupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemRefLookupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
