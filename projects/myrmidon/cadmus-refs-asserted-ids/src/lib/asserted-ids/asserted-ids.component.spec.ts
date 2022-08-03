import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssertedIdsComponent } from './asserted-ids.component';

describe('AssertedIdsComponent', () => {
  let component: AssertedIdsComponent;
  let fixture: ComponentFixture<AssertedIdsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssertedIdsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssertedIdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
