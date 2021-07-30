import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalIdsComponent } from './external-ids.component';

describe('ExternalIdsComponent', () => {
  let component: ExternalIdsComponent;
  let fixture: ComponentFixture<ExternalIdsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExternalIdsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalIdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
