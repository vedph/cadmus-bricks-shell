import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalDateComponent } from './historical-date.component';

describe('HistoricalDateComponent', () => {
  let component: HistoricalDateComponent;
  let fixture: ComponentFixture<HistoricalDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoricalDateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricalDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
