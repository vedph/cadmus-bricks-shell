import { Component } from '@angular/core';

import { AnnotationEvent } from 'projects/myrmidon/cadmus-img-annotator/src/public-api';

@Component({
  selector: 'app-sd-img-annotator-pg',
  templateUrl: './sd-img-annotator-pg.component.html',
  styleUrls: ['./sd-img-annotator-pg.component.css'],
})
export class SdImgAnnotatorPgComponent {
  public message?: string;
  constructor() {}

  ngOnInit(): void {}

  public onCreateAnnotation(event: AnnotationEvent) {
    this.message = 'CREATED:\n' + JSON.stringify(event.annotation, null, 2);
  }

  public onUpdateAnnotation(event: AnnotationEvent) {
    this.message = 'UPDATED:\n' + JSON.stringify(event.annotation, null, 2);
  }

  public onDeleteAnnotation(event: AnnotationEvent) {
    this.message = 'DELETED:\n' + JSON.stringify(event.annotation, null, 2);
  }
}
