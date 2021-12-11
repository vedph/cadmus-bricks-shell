import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefLookupPgComponent } from './ref-lookup-pg.component';

describe('RefLookupPgComponent', () => {
  let component: RefLookupPgComponent;
  let fixture: ComponentFixture<RefLookupPgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefLookupPgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RefLookupPgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
