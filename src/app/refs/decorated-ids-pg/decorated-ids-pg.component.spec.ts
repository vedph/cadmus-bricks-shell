import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecoratedIdsPgComponent } from './decorated-ids-pg.component';

describe('DecoratedIdsPgComponent', () => {
  let component: DecoratedIdsPgComponent;
  let fixture: ComponentFixture<DecoratedIdsPgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DecoratedIdsPgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DecoratedIdsPgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
