import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocReferencesPgComponent } from './doc-references-pg.component';

describe('DocReferencesPgComponent', () => {
  let component: DocReferencesPgComponent;
  let fixture: ComponentFixture<DocReferencesPgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocReferencesPgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocReferencesPgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
