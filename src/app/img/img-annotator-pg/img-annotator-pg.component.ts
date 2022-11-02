import { Component, OnInit } from '@angular/core';
import { AnnotationEvent } from '@myrmidon/cadmus-img-annotator';

@Component({
  selector: 'app-img-annotator-pg',
  templateUrl: './img-annotator-pg.component.html',
  styleUrls: ['./img-annotator-pg.component.css']
})
export class ImgAnnotatorPgComponent implements OnInit {
  public message?: string;
  constructor() { }

  ngOnInit(): void {
  }

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
