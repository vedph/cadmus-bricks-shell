import { TestBed } from '@angular/core/testing';

import { ProperNameServiceService } from './proper-name-service.service';

describe('ProperNameServiceService', () => {
  let service: ProperNameServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProperNameServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
