import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssertedIdPgComponent } from './asserted-id-pg.component';

describe('AssertedIdPgComponent', () => {
  let component: AssertedIdPgComponent;
  let fixture: ComponentFixture<AssertedIdPgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssertedIdPgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssertedIdPgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
