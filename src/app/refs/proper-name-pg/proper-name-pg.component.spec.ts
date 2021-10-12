import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProperNamePgComponent } from './proper-name-pg.component';

describe('ProperNamePgComponent', () => {
  let component: ProperNamePgComponent;
  let fixture: ComponentFixture<ProperNamePgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProperNamePgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProperNamePgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
