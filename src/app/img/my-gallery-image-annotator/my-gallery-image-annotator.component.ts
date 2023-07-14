import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import {
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatDialog,
  MatDialogConfig,
} from '@angular/material/dialog';
import { BehaviorSubject, Subscription, take } from 'rxjs';
import {
  Annotation,
  AnnotationEvent,
  ImgAnnotationListComponent,
} from 'projects/myrmidon/cadmus-img-annotator/src/public-api';
import {
  GalleryImage,
  GalleryOptionsService,
  GalleryService,
  IMAGE_GALLERY_SERVICE_KEY,
} from 'projects/myrmidon/cadmus-img-gallery/src/public-api';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { EditAnnotationDialogComponent } from '../edit-annotation-dialog/edit-annotation-dialog.component';

// TODO: move tmp to library
export interface TmpGalleryImageAnnotation<T> {
  id: string;
  target: GalleryImage;
  selector: string;
  payload?: T;
}

export interface TmpGalleryImageAnnotationSet<T> {
  image?: GalleryImage;
  annotations: TmpGalleryImageAnnotation<T>[];
}

/**
 * Sample image annotation payload: this just contains a note.
 */
export interface MyAnnotationPayload {
  note: string;
}

/**
 * Sample gallery.
 */
@Component({
  selector: 'app-my-gallery-image-annotator',
  templateUrl: './my-gallery-image-annotator.component.html',
  styleUrls: ['./my-gallery-image-annotator.component.css'],
})
export class MyGalleryImageAnnotatorComponent extends ImgAnnotationListComponent<MyAnnotationPayload> {
  private _set$: BehaviorSubject<
    TmpGalleryImageAnnotationSet<MyAnnotationPayload>
  >;
  private _sub?: Subscription;

  public imageUri?: string;
  public tool: string = 'rect';
  public tabIndex: number = 0;
  public entries: ThesaurusEntry[];

  /**
   * The gallery image to annotate.
   */
  @Input()
  public get image(): GalleryImage | undefined | null {
    return this._set$.value.image;
  }
  public set image(value: GalleryImage | undefined | null) {
    if (this._set$.value.image === value) {
      return;
    }
    // preserve existing annotations, unless they belong to a previously
    // loaded different image
    let annotations = this._set$.value.annotations;
    if (value) {
      if (annotations?.length && annotations[0].id !== value.id) {
        annotations = [];
      }
    }
    this._set$.next({
      image: value || undefined,
      annotations: annotations,
    });
    setTimeout(() => {
      this.tabIndex = 0;
    });
  }

  /**
   * The annotations being edited.
   */
  @Input()
  public get annotations(): TmpGalleryImageAnnotation<MyAnnotationPayload>[] {
    return this._set$.value.annotations;
  }
  public set annotations(
    value: TmpGalleryImageAnnotation<MyAnnotationPayload>[]
  ) {
    if (this._set$.value.annotations === value) {
      return;
    }
    // preserve existing image
    this._set$.next({ image: this._set$.value.image, annotations: value });
  }

  /**
   * Emitted whenever annotations change.
   */
  @Output()
  public annotationsChange: EventEmitter<
    TmpGalleryImageAnnotation<MyAnnotationPayload>[]
  >;

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DEFAULT_OPTIONS) public dlgConfig: MatDialogConfig,
    @Inject(IMAGE_GALLERY_SERVICE_KEY)
    private _galleryService: GalleryService,
    private _options: GalleryOptionsService
  ) {
    super(dialog, dlgConfig);

    this._set$ = new BehaviorSubject<
      TmpGalleryImageAnnotationSet<MyAnnotationPayload>
    >({ annotations: [] });
    this.annotationsChange = new EventEmitter<
      TmpGalleryImageAnnotation<MyAnnotationPayload>[]
    >();
    // mock filter entries
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
    // editor
    this.editorComponent = EditAnnotationDialogComponent;
  }

  public ngOnInit(): void {
    // whenever data change, update the image URI and its annotations
    // this._sub = this._set$.subscribe((d) => {
    //   this.imageUri = d.image?.uri;
    //   // TODO
    // });
    if (!this._set$.value.image) {
      this.tabIndex = 1;
    }
  }

  public ngOnDestroy(): void {
    this._sub?.unsubscribe();
  }

  public onToolChange(tool: string): void {
    this.tool = tool;
  }

  public onAnnotatorInit(annotator: any) {
    setTimeout(() => {
      this.annotator = annotator;
    });
  }

  public onCreateSelection(annotation: Annotation) {
    this.list?.onCreateSelection(annotation);
  }

  public onSelectAnnotation(annotation: Annotation) {
    this.list?.onSelectAnnotation(annotation);
  }

  public onCancelSelected(annotation: Annotation) {
    this.list?.onCancelSelected(annotation);
  }

  public editAnnotation(index: number): void {
    this.list?.editAnnotation(index);
  }

  public selectAnnotation(index: number): void {
    this.list?.selectAnnotation(index);
  }

  public removeAnnotation(index: number): void {
    this.list?.removeAnnotation(index);
  }

  public onCreateAnnotation(event: AnnotationEvent) {
    this.list?.onCreateAnnotation(event);
  }

  public onUpdateAnnotation(event: AnnotationEvent) {
    this.list?.onUpdateAnnotation(event);
  }

  public onDeleteAnnotation(event: AnnotationEvent) {
    this.list?.onDeleteAnnotation(event);
  }

  public onImagePick(image: GalleryImage): void {
    // get the single image as we need the "full" size
    // const options = { ...this._options, width: 600, height: 800 };

    this._galleryService
      .getImage(image.id, this._options.get())
      .pipe(take(1))
      .subscribe((image) => {
        this.image = image!;
      });
    this.tabIndex = 1;
  }
}
