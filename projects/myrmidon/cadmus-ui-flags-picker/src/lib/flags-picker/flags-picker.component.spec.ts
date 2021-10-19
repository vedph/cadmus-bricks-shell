import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlagsPickerComponent } from './flags-picker.component';

describe('FlagsPickerComponent', () => {
  let component: FlagsPickerComponent;
  let fixture: ComponentFixture<FlagsPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlagsPickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlagsPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
