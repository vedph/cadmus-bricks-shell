import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScopedPinLookupComponent } from './scoped-pin-lookup.component';

describe('ScopedPinLookupComponent', () => {
  let component: ScopedPinLookupComponent;
  let fixture: ComponentFixture<ScopedPinLookupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScopedPinLookupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScopedPinLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
