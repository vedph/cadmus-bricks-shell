import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssertedCompositeIdComponent } from './asserted-composite-id.component';

describe('AssertedIdComponent', () => {
  let component: AssertedCompositeIdComponent;
  let fixture: ComponentFixture<AssertedCompositeIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssertedCompositeIdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssertedCompositeIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
