import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefLookupOptionsComponent } from './ref-lookup-options.component';

describe('DynamicDialogComponent', () => {
  let component: RefLookupOptionsComponent;
  let fixture: ComponentFixture<RefLookupOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefLookupOptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RefLookupOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
