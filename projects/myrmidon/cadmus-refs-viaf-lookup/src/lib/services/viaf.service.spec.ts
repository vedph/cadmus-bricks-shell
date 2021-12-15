import { TestBed } from '@angular/core/testing';

import { ViafService } from './viaf.service';

describe('ViafService', () => {
  let service: ViafService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViafService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
