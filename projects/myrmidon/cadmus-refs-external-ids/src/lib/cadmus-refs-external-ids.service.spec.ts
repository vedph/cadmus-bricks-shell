import { TestBed } from '@angular/core/testing';

import { CadmusRefsExternalIdsService } from './cadmus-refs-external-ids.service';

describe('CadmusRefsExternalIdsService', () => {
  let service: CadmusRefsExternalIdsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CadmusRefsExternalIdsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
