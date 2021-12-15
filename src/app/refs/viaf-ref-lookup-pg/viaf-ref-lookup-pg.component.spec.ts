import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViafRefLookupPgComponent } from './viaf-ref-lookup-pg.component';

describe('ViafRefLookupPgComponent', () => {
  let component: ViafRefLookupPgComponent;
  let fixture: ComponentFixture<ViafRefLookupPgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViafRefLookupPgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViafRefLookupPgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
