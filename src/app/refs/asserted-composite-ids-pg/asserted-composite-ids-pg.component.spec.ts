import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssertedCompositeIdsPgComponent } from './asserted-composite-ids-pg.component';

describe('AssertedIdsPgComponent', () => {
  let component: AssertedCompositeIdsPgComponent;
  let fixture: ComponentFixture<AssertedCompositeIdsPgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssertedCompositeIdsPgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssertedCompositeIdsPgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
