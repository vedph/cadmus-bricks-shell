import { TestBed } from '@angular/core/testing';

import { DbpediaService } from './dbpedia.service';

describe('DbpediaService', () => {
  let service: DbpediaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbpediaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
