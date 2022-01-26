import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssertedChronotopeSetPgComponent } from './asserted-chronotope-set-pg.component';

describe('AssertedChronotopeSetPgComponent', () => {
  let component: AssertedChronotopeSetPgComponent;
  let fixture: ComponentFixture<AssertedChronotopeSetPgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssertedChronotopeSetPgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssertedChronotopeSetPgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
