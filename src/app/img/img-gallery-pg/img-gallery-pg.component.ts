import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ThesaurusEntry } from '@myrmidon/cadmus-core';

import { GalleryImage } from 'projects/myrmidon/cadmus-img-gallery/src/public-api';

@Component({
  selector: 'app-img-gallery-pg',
  templateUrl: './img-gallery-pg.component.html',
  styleUrls: ['./img-gallery-pg.component.css'],
})
export class ImgGalleryPgComponent {
  public entries: ThesaurusEntry[];
  public image?: GalleryImage;
  public tabIndex: number;

  constructor(private _snackbar: MatSnackBar) {
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
    this.image = image;
    this.tabIndex = 1;
  }
}
