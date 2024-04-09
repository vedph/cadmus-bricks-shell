import { TestBed } from '@angular/core/testing';

import { CadmusTextEdService } from './cadmus-text-ed.service';

describe('CadmusTextEdService', () => {
  let service: CadmusTextEdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CadmusTextEdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
