import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodLocationComponent } from './cod-location.component';

describe('CodLocationComponent', () => {
  let component: CodLocationComponent;
  let fixture: ComponentFixture<CodLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodLocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CodLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
