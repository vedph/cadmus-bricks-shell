import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalSizePgComponent } from './physical-size-pg.component';

describe('PhysicalSizePgComponent', () => {
  let component: PhysicalSizePgComponent;
  let fixture: ComponentFixture<PhysicalSizePgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhysicalSizePgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalSizePgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
