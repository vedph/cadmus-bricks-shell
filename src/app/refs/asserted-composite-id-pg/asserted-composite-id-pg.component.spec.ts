import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssertedCompositeIdPgComponent } from './asserted-composite-id-pg.component';

describe('AssertedIdPgComponent', () => {
  let component: AssertedCompositeIdPgComponent;
  let fixture: ComponentFixture<AssertedCompositeIdPgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssertedCompositeIdPgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssertedCompositeIdPgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
