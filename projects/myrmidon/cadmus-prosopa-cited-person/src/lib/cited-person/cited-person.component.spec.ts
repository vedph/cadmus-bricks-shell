import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitedPersonComponent } from './cited-person.component';

describe('CitedPersonComponent', () => {
  let component: CitedPersonComponent;
  let fixture: ComponentFixture<CitedPersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CitedPersonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CitedPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
