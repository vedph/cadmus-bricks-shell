import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssertedChronotopePgComponent } from './asserted-chronotope-pg.component';

describe('AssertedChronotopePgComponent', () => {
  let component: AssertedChronotopePgComponent;
  let fixture: ComponentFixture<AssertedChronotopePgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssertedChronotopePgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssertedChronotopePgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
