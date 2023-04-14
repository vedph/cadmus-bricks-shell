import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomActionBarComponent } from './custom-action-bar.component';

describe('CustomActionBarComponent', () => {
  let component: CustomActionBarComponent;
  let fixture: ComponentFixture<CustomActionBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomActionBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomActionBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
