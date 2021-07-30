import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalIdsPgComponent } from './external-ids-pg.component';

describe('ExternalIdsPgComponent', () => {
  let component: ExternalIdsPgComponent;
  let fixture: ComponentFixture<ExternalIdsPgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExternalIdsPgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalIdsPgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
