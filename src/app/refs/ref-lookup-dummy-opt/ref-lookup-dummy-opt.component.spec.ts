import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefLookupDummyOptComponent } from './ref-lookup-dummy-opt.component';

describe('RefLookupDummyOptComponent', () => {
  let component: RefLookupDummyOptComponent;
  let fixture: ComponentFixture<RefLookupDummyOptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefLookupDummyOptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RefLookupDummyOptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
