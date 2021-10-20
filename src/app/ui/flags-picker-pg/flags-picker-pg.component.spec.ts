import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlagsPickerPgComponent } from './flags-picker-pg.component';

describe('FlagsPickerPgComponent', () => {
  let component: FlagsPickerPgComponent;
  let fixture: ComponentFixture<FlagsPickerPgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlagsPickerPgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlagsPickerPgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
