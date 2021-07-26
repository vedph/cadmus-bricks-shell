import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocReferencesComponent } from './doc-references.component';

describe('DocReferencesComponent', () => {
  let component: DocReferencesComponent;
  let fixture: ComponentFixture<DocReferencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocReferencesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocReferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
