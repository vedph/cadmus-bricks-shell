import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChronotopeComponent } from './chronotope.component';

describe('ChronotopeComponent', () => {
  let component: ChronotopeComponent;
  let fixture: ComponentFixture<ChronotopeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChronotopeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChronotopeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
