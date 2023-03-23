import { Component, Inject } from '@angular/core';
import { take } from 'rxjs';

import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import {
  GalleryImage,
  GalleryImageAnnotation,
  GalleryOptions,
  GalleryService,
  IMAGE_GALLERY_OPTIONS_KEY,
  IMAGE_GALLERY_SERVICE_KEY,
} from '@myrmidon/cadmus-img-gallery';

@Component({
  selector: 'app-sd-img-gallery-pg',
  templateUrl: './sd-img-gallery-pg.component.html',
  styleUrls: ['./sd-img-gallery-pg.component.css'],
})
export class SdImgGalleryPgComponent {
  public entries: ThesaurusEntry[];
  public image?: GalleryImage;
  public tabIndex: number;

  public annotations?: GalleryImageAnnotation[];

  constructor(
    @Inject(IMAGE_GALLERY_SERVICE_KEY)
    private _galleryService: GalleryService,
    @Inject(IMAGE_GALLERY_OPTIONS_KEY)
    private _options: GalleryOptions
  ) {
    this.tabIndex = 0;
    this.entries = [
      {
        id: 'title',
        value: 'title',
      },
      {
        id: 'dsc',
        value: 'description',
      },
    ];
  }

  public onImagePick(image: GalleryImage): void {
    // get the single image as we need the "full" size
    const options = { ...this._options, width: 600, height: 800 };

    this._galleryService
      .getImage(image.id, options)
      .pipe(take(1))
      .subscribe((image) => {
        this.image = image!;
      });
    this.tabIndex = 1;
  }

  public onAnnotationsChange(annotations: GalleryImageAnnotation[]): void {
    this.annotations = annotations;
  }
}
