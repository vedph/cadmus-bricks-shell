import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefLookupSetPgComponent } from './ref-lookup-set-pg.component';

describe('RefLookupSetPgComponent', () => {
  let component: RefLookupSetPgComponent;
  let fixture: ComponentFixture<RefLookupSetPgComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RefLookupSetPgComponent]
    });
    fixture = TestBed.createComponent(RefLookupSetPgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
