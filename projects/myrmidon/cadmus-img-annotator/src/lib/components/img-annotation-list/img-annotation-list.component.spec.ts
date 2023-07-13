import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgAnnotationListComponent } from './img-annotation-list.component';

describe('ImgAnnotationListComponent', () => {
  let component: ImgAnnotationListComponent;
  let fixture: ComponentFixture<ImgAnnotationListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImgAnnotationListComponent]
    });
    fixture = TestBed.createComponent(ImgAnnotationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
