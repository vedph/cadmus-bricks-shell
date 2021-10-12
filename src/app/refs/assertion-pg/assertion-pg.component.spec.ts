import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssertionPgComponent } from './assertion-pg.component';

describe('AssertionPgComponent', () => {
  let component: AssertionPgComponent;
  let fixture: ComponentFixture<AssertionPgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssertionPgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssertionPgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
