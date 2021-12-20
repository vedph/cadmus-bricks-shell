import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalDimensionComponent } from './physical-dimension.component';

describe('PhysicalDimensionComponent', () => {
  let component: PhysicalDimensionComponent;
  let fixture: ComponentFixture<PhysicalDimensionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhysicalDimensionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalDimensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
