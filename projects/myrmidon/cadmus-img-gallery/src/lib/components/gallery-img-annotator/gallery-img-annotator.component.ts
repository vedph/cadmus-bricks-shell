import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

import { AnnotationEvent } from '@myrmidon/cadmus-img-annotator';

import { GalleryImage } from '../../models';

/**
 * Essential metadata mostly extracted from the W3C annotation produced
 * by Annotorious.
 */
export interface GalleryImageAnnotation {
  id: string;
  target: GalleryImage;
  selector: string;
  note?: string;
  tags?: string[];
}

interface GalleryImgAnnotatorData {
  image?: GalleryImage;
  annotations: GalleryImageAnnotation[];
}

@Component({
  selector: 'cadmus-gallery-img-annotator',
  templateUrl: './gallery-img-annotator.component.html',
  styleUrls: ['./gallery-img-annotator.component.css'],
})
export class GalleryImgAnnotatorComponent implements OnInit, OnDestroy {
  private _sub?: Subscription;
  private _data$: BehaviorSubject<GalleryImgAnnotatorData>;

  public w3cAnnotations: any[];
  public imageUri?: string;

  /**
   * The gallery image to annotate.
   */
  @Input()
  public get image(): GalleryImage | undefined | null {
    return this._data$.value.image;
  }
  public set image(value: GalleryImage | undefined | null) {
    if (this._data$.value.image === value) {
      return;
    }
    this._data$.next({ ...this._data$.value, image: value || undefined });
  }

  /**
   * The annotations being edited.
   */
  @Input()
  public get annotations(): GalleryImageAnnotation[] {
    return this._data$.value.annotations;
  }
  public set annotations(value: GalleryImageAnnotation[]) {
    if (this._data$.value.annotations === value) {
      return;
    }
    this._data$.next({ ...this._data$.value, annotations: value });
  }

  /**
   * Emitted whenever annotations change.
   */
  @Output()
  public annotationsChange: EventEmitter<GalleryImageAnnotation[]>;

  constructor() {
    this.w3cAnnotations = [];
    this._data$ = new BehaviorSubject<GalleryImgAnnotatorData>({
      annotations: [],
    });
    this.annotationsChange = new EventEmitter<GalleryImageAnnotation[]>();
  }

  private eventToAnnotation(event: AnnotationEvent): GalleryImageAnnotation {
    return {
      id: event.annotation.id,
      target: this._data$.value.image!,
      selector: event.annotation.target.selector.value,
      note: event.annotation.body?.find((e) => e.purpose === 'commenting')
        ?.value,
      tags: event.annotation.body
        ?.filter((e) => e.purpose === 'tagging')
        .map((e) => e.value),
    };
  }

  private annotationsToW3C(annotations: GalleryImageAnnotation[]): any[] {
    if (!annotations.length) {
      return [];
    }
    const results: any[] = [];

    for (let i = 0; i < annotations.length; i++) {
      const a = annotations[i];
      const r: any = { id: a.id };
      r['@context'] = 'http://www.w3.org/ns/anno.jsonld';
      r.type = 'Annotation';
      r.target = {
        source: a.target.uri,
        selector: {
          type: 'FragmentSelector',
          conformsTo: 'http://www.w3.org/TR/media-frags/',
          value: a.selector,
        },
      };
      if (a.note || a.tags?.length) {
        r.body = [];
        if (a.note) {
          r.body.push({
            type: 'TextualBody',
            purpose: 'commenting',
            value: a.note,
          });
        }
        if (a.tags?.length) {
          for (let j = 0; j < a.tags.length; j++) {
            r.body.push({
              type: 'TextualBody',
              purpose: 'tagging',
              value: a.tags[j],
            });
          }
        }
      }
      results.push(r);
    }
    return results;
  }

  public ngOnInit(): void {
    this._sub = this._data$.subscribe((d) => {
      this.imageUri = d.image?.uri;
      this.w3cAnnotations = this.annotationsToW3C(d.annotations);
    });
  }

  public ngOnDestroy(): void {
    this._sub?.unsubscribe();
  }

  public onCreateAnnotation(event: AnnotationEvent) {
    const annotations = [...this._data$.value.annotations];
    annotations.push(this.eventToAnnotation(event));
    this._data$.next({ ...this._data$, annotations: annotations });
    this.annotationsChange.emit(annotations);
  }

  public onUpdateAnnotation(event: AnnotationEvent) {
    const i = this.annotations.findIndex((a) => a.id === event.annotation.id);
    if (i > -1) {
      const annotations = [...this._data$.value.annotations];
      annotations.splice(i, 1, this.eventToAnnotation(event));
      this._data$.next({ ...this._data$, annotations: annotations });
      this.annotationsChange.emit(annotations);
    }
  }

  public onDeleteAnnotation(event: AnnotationEvent) {
    const i = this._data$.value.annotations.findIndex(
      (a) => a.id === event.annotation.id
    );
    if (i > -1) {
      const annotations = [...this._data$.value.annotations];
      annotations.splice(i, 1);
      this._data$.next({ ...this._data$, annotations: annotations });
      this.annotationsChange.emit(annotations);
    }
  }
}
