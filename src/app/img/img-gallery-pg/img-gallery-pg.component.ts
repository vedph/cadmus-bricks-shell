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
} from 'projects/myrmidon/cadmus-img-gallery/src/public-api';
import {
  BarCustomAction,
  BarCustomActionRequest,
} from 'projects/myrmidon/cadmus-ui-custom-action-bar/src/public-api';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-img-gallery-pg',
  templateUrl: './img-gallery-pg.component.html',
  styleUrls: ['./img-gallery-pg.component.css'],
})
export class ImgGalleryPgComponent {
  public entries: ThesaurusEntry[];
  public image?: GalleryImage;
  public tabIndex: number;

  public annotations?: GalleryImageAnnotation[];
  public actions: BarCustomAction[];

  constructor(
    @Inject(IMAGE_GALLERY_SERVICE_KEY)
    private _galleryService: GalleryService,
    @Inject(IMAGE_GALLERY_OPTIONS_KEY)
    private _options: GalleryOptions,
    private _snackbar: MatSnackBar
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
    this.actions = [
      {
        id: 'test',
        iconId: 'thumb_up',
        tip: 'Test',
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

  public onActionRequest(action: BarCustomActionRequest): void {
    console.log('action', JSON.stringify(action));
    this._snackbar.open('Action: ' + action.id, 'OK');
  }
}
