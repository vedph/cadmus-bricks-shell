import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssertedIdComponent } from './asserted-id.component';

describe('AssertedIdComponent', () => {
  let component: AssertedIdComponent;
  let fixture: ComponentFixture<AssertedIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssertedIdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssertedIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
