import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecoratedIdsComponent } from './decorated-ids.component';

describe('DecoratedIdsComponent', () => {
  let component: DecoratedIdsComponent;
  let fixture: ComponentFixture<DecoratedIdsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DecoratedIdsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DecoratedIdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
