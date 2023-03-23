import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GallerySdimgAnnotatorComponent } from './gallery-sdimg-annotator.component';

describe('GallerySdimgAnnotatorComponent', () => {
  let component: GallerySdimgAnnotatorComponent;
  let fixture: ComponentFixture<GallerySdimgAnnotatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GallerySdimgAnnotatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GallerySdimgAnnotatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
