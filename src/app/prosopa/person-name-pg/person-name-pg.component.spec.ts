import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonNamePgComponent } from './person-name-pg.component';

describe('PersonNamePgComponent', () => {
  let component: PersonNamePgComponent;
  let fixture: ComponentFixture<PersonNamePgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonNamePgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonNamePgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
