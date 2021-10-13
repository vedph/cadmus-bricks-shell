import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChronotopePgComponent } from './chronotope-pg.component';

describe('ChronotopePgComponent', () => {
  let component: ChronotopePgComponent;
  let fixture: ComponentFixture<ChronotopePgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChronotopePgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChronotopePgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
