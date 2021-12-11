import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefLookupComponent } from './ref-lookup.component';

describe('RefLookupComponent', () => {
  let component: RefLookupComponent;
  let fixture: ComponentFixture<RefLookupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefLookupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RefLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
