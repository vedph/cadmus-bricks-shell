import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SdImgGalleryPgComponent } from './sd-img-gallery-pg.component';

describe('SdImgGalleryPgComponent', () => {
  let component: SdImgGalleryPgComponent;
  let fixture: ComponentFixture<SdImgGalleryPgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SdImgGalleryPgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SdImgGalleryPgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
