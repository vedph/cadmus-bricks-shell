import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitedPersonPgComponent } from './cited-person-pg.component';

describe('CitedPersonPgComponent', () => {
  let component: CitedPersonPgComponent;
  let fixture: ComponentFixture<CitedPersonPgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CitedPersonPgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CitedPersonPgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
