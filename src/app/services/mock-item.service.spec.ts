import { TestBed } from '@angular/core/testing';

import { MockItemService } from './mock-item.service';

describe('MockItemService', () => {
  let service: MockItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
