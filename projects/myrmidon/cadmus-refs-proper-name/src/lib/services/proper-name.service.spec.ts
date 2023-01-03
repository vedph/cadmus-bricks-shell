import { TestBed } from '@angular/core/testing';

import { ProperNameService } from './proper-name.service';

describe('ProperNameService', () => {
  let service: ProperNameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProperNameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
