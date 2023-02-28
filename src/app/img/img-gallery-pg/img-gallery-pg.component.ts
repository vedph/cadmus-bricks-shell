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

  constructor(private _snackbar: MatSnackBar) {
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
    this._snackbar.open('Image picked: ' + image.title, 'OK', {
      duration: 2000,
    });
  }
}
