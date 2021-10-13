import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalDatePgComponent } from './historical-date-pg.component';

describe('HistoricalDatePgComponent', () => {
  let component: HistoricalDatePgComponent;
  let fixture: ComponentFixture<HistoricalDatePgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoricalDatePgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricalDatePgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
