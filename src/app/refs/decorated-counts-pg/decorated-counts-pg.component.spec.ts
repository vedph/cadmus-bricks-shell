import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecoratedCountsPgComponent } from './decorated-counts-pg.component';

describe('DecoratedCountsPgComponent', () => {
  let component: DecoratedCountsPgComponent;
  let fixture: ComponentFixture<DecoratedCountsPgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DecoratedCountsPgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DecoratedCountsPgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
