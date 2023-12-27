import { TestBed } from '@angular/core/testing';

import { DbpediaRefLookupService } from './dbpedia-ref-lookup.service';

describe('DbpediaRefLookupService', () => {
  let service: DbpediaRefLookupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbpediaRefLookupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
