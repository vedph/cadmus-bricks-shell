import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyGalleryImageAnnotatorComponent } from './my-gallery-image-annotator.component';

describe('MyGalleryImageAnnotatorComponent', () => {
  let component: MyGalleryImageAnnotatorComponent;
  let fixture: ComponentFixture<MyGalleryImageAnnotatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyGalleryImageAnnotatorComponent]
    });
    fixture = TestBed.createComponent(MyGalleryImageAnnotatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
