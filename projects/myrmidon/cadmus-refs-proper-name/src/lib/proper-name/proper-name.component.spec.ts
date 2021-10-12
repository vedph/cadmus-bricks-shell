import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProperNameComponent } from './proper-name.component';

describe('ProperNameComponent', () => {
  let component: ProperNameComponent;
  let fixture: ComponentFixture<ProperNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProperNameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProperNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
