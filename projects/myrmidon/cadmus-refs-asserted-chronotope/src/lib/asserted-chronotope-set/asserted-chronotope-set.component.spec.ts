import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssertedChronotopeSetComponent } from './asserted-chronotope-set.component';

describe('AssertedChronotopeSetComponent', () => {
  let component: AssertedChronotopeSetComponent;
  let fixture: ComponentFixture<AssertedChronotopeSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssertedChronotopeSetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssertedChronotopeSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
