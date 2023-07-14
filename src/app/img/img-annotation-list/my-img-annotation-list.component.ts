import { Component } from '@angular/core';
import { ImgAnnotationListComponent } from 'projects/myrmidon/cadmus-img-annotator/src/public-api';

@Component({
  selector: 'app-my-img-annotation-list',
  templateUrl: './my-img-annotation-list.component.html',
  styleUrls: ['./my-img-annotation-list.component.css'],
})
export class MyImgAnnotationListComponent extends ImgAnnotationListComponent<any> {
  public selectAnnotation(annotation: any): void {
    this.list?.selectAnnotation(annotation);
  }

  public removeAnnotation(index: number): void {
    this.list?.removeAnnotation(index);
  }

  public editAnnotation(annotation: any): void {
    this.list?.editAnnotation(annotation);
  }
}
