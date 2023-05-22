import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssertedCompositeIdsComponent } from './asserted-composite-ids.component';

describe('AssertedIdsComponent', () => {
  let component: AssertedCompositeIdsComponent;
  let fixture: ComponentFixture<AssertedCompositeIdsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssertedCompositeIdsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssertedCompositeIdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
