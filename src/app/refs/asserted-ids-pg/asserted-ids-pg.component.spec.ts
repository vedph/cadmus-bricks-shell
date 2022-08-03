import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssertedIdsPgComponent } from './asserted-ids-pg.component';

describe('AssertedIdsPgComponent', () => {
  let component: AssertedIdsPgComponent;
  let fixture: ComponentFixture<AssertedIdsPgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssertedIdsPgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssertedIdsPgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
