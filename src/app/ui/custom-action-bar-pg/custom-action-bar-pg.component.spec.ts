import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomActionBarPgComponent } from './custom-action-bar-pg.component';

describe('CustomActionBarPgComponent', () => {
  let component: CustomActionBarPgComponent;
  let fixture: ComponentFixture<CustomActionBarPgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomActionBarPgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomActionBarPgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
