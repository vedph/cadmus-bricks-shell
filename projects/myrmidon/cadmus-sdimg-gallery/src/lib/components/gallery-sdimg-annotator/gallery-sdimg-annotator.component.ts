import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { AnnotationEvent } from '@myrmidon/cadmus-img-annotator';
import {
  GalleryImage,
  GalleryImageAnnotation,
} from '@myrmidon/cadmus-img-gallery';

interface GalleryImgAnnotatorData {
  image?: GalleryImage;
  annotations: GalleryImageAnnotation[];
}

@Component({
  selector: 'cadmus-gallery-sdimg-annotator',
  templateUrl: './gallery-sdimg-annotator.component.html',
  styleUrls: ['./gallery-sdimg-annotator.component.css'],
})
export class GallerySdimgAnnotatorComponent implements OnInit, OnDestroy {
  private _frozen?: boolean;
  private _sub?: Subscription;
  private _data$: BehaviorSubject<GalleryImgAnnotatorData>;

  /**
   * The W3C annotations come from the annotator and are kept in synch
   * with annotations, so that we can interact with visuals.
   */
  public w3cAnnotations: any[];
  public selectedW3cAnnotation?: any;

  public imageUri?: string;
  public data$: Observable<GalleryImgAnnotatorData>;

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
    // preserve existing annotations, unless they belong to a previously
    // loaded different image
    let annotations = this._data$.value.annotations;
    if (value) {
      if (annotations?.length && annotations[0].id !== value.id) {
        annotations = [];
      }
    }
    this._data$.next({
      image: value || undefined,
      annotations: annotations,
    });
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
    // preserve existing image
    this._data$.next({ image: this._data$.value.image, annotations: value });
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
    this.data$ = this._data$.asObservable();
    this.annotationsChange = new EventEmitter<GalleryImageAnnotation[]>();
  }

  private eventToAnnotation(event: AnnotationEvent): GalleryImageAnnotation {
    return {
      id: event.annotation.id,
      target: this._data$.value.image!,
      selector: event.annotation.target.selector.value,
      notes: event.annotation.body
        ?.filter((e) => e.purpose === 'commenting')
        .map((e) => e.value),
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
      if (a.notes?.length || a.tags?.length) {
        r.body = [];
        if (a.notes?.length) {
          for (let j = 0; j < a.notes.length; j++) {
            r.body.push({
              type: 'TextualBody',
              purpose: 'commenting',
              value: a.notes[j],
            });
          }
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
    // whenever data change, update the image URI and its W3C annotations
    this._sub = this._data$.subscribe((d) => {
      if (!this._frozen) {
        this.imageUri = d.image?.uri;
        this.w3cAnnotations = this.annotationsToW3C(d.annotations);
      }
    });
  }

  public ngOnDestroy(): void {
    this._sub?.unsubscribe();
  }

  public onCreateAnnotation(event: AnnotationEvent) {
    // append the newly created W3C annotation
    this.w3cAnnotations = [...this.w3cAnnotations, event.annotation];

    // append the annotation
    const annotations = [...this._data$.value.annotations];
    annotations.push(this.eventToAnnotation(event));
    this._frozen = true;
    this._data$.next({
      image: this._data$.value.image,
      annotations: annotations,
    });
    this._frozen = false;

    // fire event
    this.annotationsChange.emit(annotations);
  }

  public onUpdateAnnotation(event: AnnotationEvent) {
    // replace the old W3C annotation with the new one
    const i = this.annotations.findIndex((a) => a.id === event.annotation.id);
    if (i > -1) {
      const w3cAnnotations = [...this.w3cAnnotations];
      w3cAnnotations.splice(i, 1, event.annotation);
      this.w3cAnnotations = w3cAnnotations;

      // replace the annotation
      const annotations = [...this._data$.value.annotations];
      annotations.splice(i, 1, this.eventToAnnotation(event));
      this._frozen = true;
      this._data$.next({
        image: this._data$.value.image,
        annotations: annotations,
      });
      this._frozen = false;

      // fire event
      this.annotationsChange.emit(annotations);
    }
  }

  public onDeleteAnnotation(event: AnnotationEvent) {
    // delete the W3C annotation
    const i = this._data$.value.annotations.findIndex(
      (a) => a.id === event.annotation.id
    );
    if (i === -1) {
      return;
    }
    const w3cAnnotations = [...this.w3cAnnotations];
    w3cAnnotations.splice(i, 1);
    this.w3cAnnotations = w3cAnnotations;

    // delete the annotation
    const annotations = [...this._data$.value.annotations];
    annotations.splice(i, 1);
    this._frozen = true;
    this._data$.next({
      image: this._data$.value.image,
      annotations: annotations,
    });
    this._frozen = false;

    // fire event
    this.annotationsChange.emit(annotations);
  }

  public selectAnnotation(index: number): void {
    this.selectedW3cAnnotation = this.w3cAnnotations[index];
  }
}
