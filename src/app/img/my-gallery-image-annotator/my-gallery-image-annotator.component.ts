import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatDialog,
  MatDialogConfig,
} from '@angular/material/dialog';
import { Subscription, take } from 'rxjs';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';

import {
  Annotation,
  AnnotationEvent,
  GalleryAnnotatedImage,
  ImgAnnotationList,
  ListAnnotation,
} from 'projects/myrmidon/cadmus-img-annotator/src/public-api';
import {
  GalleryImage,
  GalleryOptionsService,
  GalleryService,
  IMAGE_GALLERY_SERVICE_KEY,
} from 'projects/myrmidon/cadmus-img-gallery/src/public-api';

import { EditAnnotationDialogComponent } from '../edit-annotation-dialog/edit-annotation-dialog.component';

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
export class MyGalleryImageAnnotatorComponent implements OnInit, OnDestroy {
  private _sub?: Subscription;
  private _image?: GalleryImage;
  private _list?: ImgAnnotationList<MyAnnotationPayload>;

  public entries: ThesaurusEntry[];
  public annotator?: any;
  public editorComponent = EditAnnotationDialogComponent;
  public tool: string = 'rect';
  public tabIndex: number = 0;

  /**
   * The gallery image to annotate.
   */
  @Input()
  public get image(): GalleryImage | undefined | null {
    return this._image;
  }
  public set image(value: GalleryImage | undefined | null) {
    if (this._image === value) {
      return;
    }
    this._image = value || undefined;
    // reset annotations if image URI changed
    if (this._image?.uri !== value?.uri) {
      this._list?.clearAnnotations();
    }
    // switch to image tab
    setTimeout(() => {
      this.tabIndex = value ? 0 : 1;
    });
  }

  /**
   * The annotations being edited.
   */
  @Input()
  public get annotations(): ListAnnotation<MyAnnotationPayload>[] {
    return this._list?.getAnnotations() || [];
  }
  public set annotations(value: ListAnnotation<MyAnnotationPayload>[]) {
    this._list?.setAnnotations(value);
  }

  /**
   * Emitted whenever annotations change.
   */
  @Output()
  public annotationsChange: EventEmitter<
    GalleryAnnotatedImage<MyAnnotationPayload>
  >;

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DEFAULT_OPTIONS) public dlgConfig: MatDialogConfig,
    @Inject(IMAGE_GALLERY_SERVICE_KEY)
    private _galleryService: GalleryService,
    private _options: GalleryOptionsService
  ) {
    this.annotationsChange = new EventEmitter<
      GalleryAnnotatedImage<MyAnnotationPayload>
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
  }

  public ngOnInit(): void {
    if (!this._image) {
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

  public onListInit(list: ImgAnnotationList<MyAnnotationPayload>) {
    this._list = list;

    // emit annotations whenever they change
    this._sub?.unsubscribe();
    this._sub = this._list.annotations$.subscribe((annotations) => {
      if (this._image) {
        this.annotationsChange.emit({
          image: this._image,
          annotations: annotations,
        });
      }
    });
  }

  public onCreateSelection(annotation: Annotation) {
    this._list?.onCreateSelection(annotation);
  }

  public onSelectAnnotation(annotation: Annotation) {
    this._list?.onSelectAnnotation(annotation);
  }

  public onCancelSelected(annotation: Annotation) {
    this._list?.onCancelSelected(annotation);
  }

  public editAnnotation(index: number): void {
    this._list?.editAnnotation(index);
  }

  public selectAnnotation(index: number): void {
    this._list?.selectAnnotation(index);
  }

  public removeAnnotation(index: number): void {
    this._list?.removeAnnotation(index);
  }

  public onCreateAnnotation(event: AnnotationEvent) {
    this._list?.onCreateAnnotation(event);
  }

  public onUpdateAnnotation(event: AnnotationEvent) {
    this._list?.onUpdateAnnotation(event);
  }

  public onDeleteAnnotation(event: AnnotationEvent) {
    this._list?.onDeleteAnnotation(event);
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
