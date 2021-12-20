import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalSizeComponent } from './physical-size.component';

describe('PhysicalSizeComponent', () => {
  let component: PhysicalSizeComponent;
  let fixture: ComponentFixture<PhysicalSizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhysicalSizeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalSizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
