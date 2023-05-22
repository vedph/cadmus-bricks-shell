import { TestBed } from '@angular/core/testing';

import { MockThesaurusService } from './mock-thesaurus.service';

describe('MockThesaurusService', () => {
  let service: MockThesaurusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockThesaurusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
