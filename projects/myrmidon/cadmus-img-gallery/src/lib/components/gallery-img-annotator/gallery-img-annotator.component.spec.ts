import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryImgAnnotatorComponent } from './gallery-img-annotator.component';

describe('GalleryImgAnnotatorComponent', () => {
  let component: GalleryImgAnnotatorComponent;
  let fixture: ComponentFixture<GalleryImgAnnotatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GalleryImgAnnotatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GalleryImgAnnotatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
