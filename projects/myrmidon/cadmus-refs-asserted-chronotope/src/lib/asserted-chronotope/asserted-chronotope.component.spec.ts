import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssertedChronotopeComponent } from './asserted-chronotope.component';

describe('AssertedChronotopeComponent', () => {
  let component: AssertedChronotopeComponent;
  let fixture: ComponentFixture<AssertedChronotopeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssertedChronotopeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssertedChronotopeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
