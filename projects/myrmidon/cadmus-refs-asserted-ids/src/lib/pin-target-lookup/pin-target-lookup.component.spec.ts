import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PinTargetLookupComponent } from './pin-target-lookup.component';

describe('PinTargetLookupComponent', () => {
  let component: PinTargetLookupComponent;
  let fixture: ComponentFixture<PinTargetLookupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PinTargetLookupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PinTargetLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
