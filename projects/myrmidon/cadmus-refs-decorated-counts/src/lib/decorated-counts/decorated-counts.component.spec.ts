import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecoratedCountsComponent } from './decorated-counts.component';

describe('DecoratedCountsComponent', () => {
  let component: DecoratedCountsComponent;
  let fixture: ComponentFixture<DecoratedCountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DecoratedCountsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DecoratedCountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
