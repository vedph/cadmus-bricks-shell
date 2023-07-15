import { BehaviorSubject, Observable, take } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import {
  Annotation,
  AnnotationEvent,
  GalleryImage,
} from '../../directives/img-annotator.directive';

/**
 * An annotation included in a list. Each annotation is paired
 * with custom payload data, edited in a dialog using as content
 * the component specified by editorComponent.
 */
export interface ListAnnotation<T> {
  id: string;
  image: GalleryImage;
  value: Annotation;
  payload?: T;
}

/**
 * A list of image annotations. This list empowers an image annotations list
 * component by maintaining a list of annotation/payload pairs for each
 * annotation, where the payload type is defined by T.
 * This list requires an instance of Annotorious annotator, and the type
 * of the editor component to use for editing each annotation. It will
 * then use the annotator to keep in synch with Annotorious, and a dialog
 * wrapper to edit each annotation via the provided editor.
 * Consumers should thus provide an annotation editor and a corresponding
 * dialog component wrapper, which wires the annotation to the editor.
 */
export class ImgAnnotationList<T> {
  private _annotations$: BehaviorSubject<ListAnnotation<T>[]>;
  private _selectedAnnotation$: BehaviorSubject<ListAnnotation<T> | null>;
  private _selectedIndex: number;
  private _currentIsNew?: boolean;
  private _pendingAnnotation?: ListAnnotation<T>;

  /**
   * The annotations in this list.
   */
  public get annotations$(): Observable<ListAnnotation<T>[]> {
    return this._annotations$.asObservable();
  }

  /**
   * The selected annotation if any.
   */
  public get selectedAnnotation$(): Observable<ListAnnotation<T> | null> {
    return this._selectedAnnotation$.asObservable();
  }

  /**
   * The function used to build a string from a list annotation object,
   * summarizing its content appropriately.
   */
  public annotationToString: (object: ListAnnotation<any>) => string | null;

  /**
   * The image to be annotated.
   */
  public image?: GalleryImage;

  constructor(
    public annotator: any,
    public editorComponent: any,
    public dialog: MatDialog,
    public dlgConfig: MatDialogConfig
  ) {
    this._annotations$ = new BehaviorSubject<ListAnnotation<T>[]>([]);
    this._selectedAnnotation$ = new BehaviorSubject<ListAnnotation<T> | null>(
      null
    );
    this._selectedIndex = -1;
    this.annotationToString = (a: ListAnnotation<any>) => {
      return a.value.body?.length ? a.value.body[0].value : a.id;
    };
  }

  /**
   * Gets the annotations.
   * @returns The annotations in this list.
   */
  public getAnnotations(): ListAnnotation<T>[] {
    return this._annotations$.value;
  }

  /**
   * Gets the W3C annotations in the Annotorious annotator.
   * @returns The annotations in the Annotorious annotator.
   */
  public getW3CAnnotations(): Annotation[] {
    return this.annotator.getAnnotations();
  }

  /**
   * Set the annotations.
   * @param annotations The annotations to set.
   */
  public setAnnotations(annotations: ListAnnotation<T>[]): void {
    this._annotations$.next(annotations);
    this.annotator.setAnnotations(annotations.map((a) => a.value));
  }

  /**
   * Removes all the annotations.
   */
  public clearAnnotations(): void {
    this._annotations$.next([]);
    this.annotator.clearAnnotations();
  }

  /**
   * Deselect the selected annotation if any.
   */
  private deselectAnnotation(): void {
    if (!this._selectedAnnotation$.value) {
      return;
    }
    // deselect in Annotorious and also delete if it was newly added
    // (user canceled the editor dialog)
    this.annotator.cancelSelected();
    if (this._currentIsNew) {
      // remove by instance because we do not yet have an ID
      this.annotator.removeAnnotation(this._selectedAnnotation$.value.value);
    }
    this._selectedAnnotation$.next(null);
    this._selectedIndex = -1;
    this._currentIsNew = false;
  }

  /**
   * Save the specified list annotation.
   * @param annotation The annotation.
   */
  private saveAnnotation(annotation: ListAnnotation<any>): void {
    // update in annotorious
    this.annotator.updateSelected(annotation.value, true);
    // local list will be updated on create event, but we must
    // preserve its payload here because Annotorious knows nothing
    // about it
    this._pendingAnnotation = annotation;
    // if instead it is not new, update the payload in the list
    if (annotation.id) {
      const annotations = [...this._annotations$.value];
      const index = annotations.findIndex((a) => a.id === annotation.id);
      if (index > -1) {
        annotations.splice(index, 1, annotation);
        this._annotations$.next(annotations);
      }
    }
    this.deselectAnnotation();
  }

  /**
   * Edit the selected annotation in the editor dialog.
   */
  private editSelectedAnnotation(): void {
    if (!this._selectedAnnotation$.value) {
      return;
    }
    const payload = this._annotations$.value.find(
      (a) => a.id === this._selectedAnnotation$.value?.id
    )?.payload;

    // edit
    const dialogRef = this.dialog.open(this.editorComponent, {
      ...this.dlgConfig,
      data: {
        id: this._selectedAnnotation$.value.id,
        value: this._selectedAnnotation$.value.value,
        payload,
      },
    });
    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result: ListAnnotation<any>) => {
        // save on OK, else remove if was new
        if (result) {
          this.saveAnnotation(result);
        } else {
          if (this._currentIsNew) {
            this.annotator.removeAnnotation(
              this._selectedAnnotation$.value!.value
            );
            this._currentIsNew = false;
          }
        }
        this._selectedAnnotation$.next(result || null);
      });
  }

  /**
   * Handle the creation of a new selection by opening the annotation
   * editor and updating the received annotation if saved, or removing it
   * if canceled.
   * @param annotation The annotation.
   */
  public onCreateSelection(annotation: Annotation) {
    console.log('onCreateSelection');
    this._currentIsNew = true;
    this._selectedAnnotation$.next({
      id: annotation.id!,
      image: this.image!,
      value: annotation,
    });
    this.editSelectedAnnotation();
  }

  /**
   * Handle the Annotorious select event.
   * @param annotation The annotation.
   */
  public onSelectAnnotation(annotation: Annotation) {
    console.log('onSelectAnnotation');
    this._selectedIndex = this._annotations$.value.findIndex(
      (a) => a.id === annotation.id
    );
    // defensive, should not happen
    if (this._selectedIndex === -1) {
      return;
    }
    this._selectedAnnotation$.next(
      this._annotations$.value[this._selectedIndex]
    );
  }

  /**
   * Handle the Annotorious cancelSelected event.
   * @param annotation The annotation.
   */
  public onCancelSelected(annotation: Annotation) {
    console.log('onCancelSelected');
    this._currentIsNew = false;
    this._selectedAnnotation$.next(null);
    this._selectedIndex = -1;
    this._currentIsNew = false;
  }

  /**
   * Edit the annotation at the specified index.
   * @param index The annotation index.
   */
  public editAnnotation(index: number): void {
    this._selectedAnnotation$.next(this._annotations$.value[index]);
    this._selectedIndex = index;
    this.editSelectedAnnotation();
  }

  /**
   * Select the annotation at the specified index.
   * @param index The annotation index.
   */
  public selectAnnotation(index: number): void {
    this._selectedIndex = index;
    if (index === -1) {
      this._selectedAnnotation$.next(null);
      this.annotator.cancelSelected();
    } else {
      this._selectedAnnotation$.next(this._annotations$.value[index]);
      this.annotator.selectAnnotation(this._selectedAnnotation$.value!.id);
    }
  }

  /**
   * Remove the annotation at the specified index.
   * @param index The annotation index.
   */
  public removeAnnotation(index: number): void {
    // deselect annotation before deleting it
    if (this._selectedIndex === index) {
      this.deselectAnnotation();
    }
    const annotation = this._annotations$.value[index];
    // remove from annotorious
    this.annotator.removeAnnotation(annotation.id);
    // remove from local
    const annotations = [...this._annotations$.value];
    annotations.splice(index, 1);
    this._annotations$.next(annotations);
  }

  /**
   * Handle the Annotorious create event.
   * @param event The event.
   */
  public onCreateAnnotation(event: AnnotationEvent) {
    console.log('onCreateAnnotation');
    this._annotations$.next([
      ...this._annotations$.value,
      {
        id: event.annotation.id!,
        image: this.image!,
        value: event.annotation,
        payload: this._pendingAnnotation?.payload,
      },
    ]);
    this._pendingAnnotation = undefined;
  }

  /**
   * Handle the Annotorious update event.
   * @param event The event.
   */
  public onUpdateAnnotation(event: AnnotationEvent) {
    console.log('onUpdateAnnotation');
    const i = this._annotations$.value.findIndex(
      (a) => a.id === event.annotation.id
    );
    if (i > -1) {
      // update value only
      const annotations = [...this._annotations$.value];
      annotations[i] = { ...annotations[i], value: event.annotation };
      this._annotations$.next(annotations);
    }
  }

  /**
   * Handle the Annotorious delete event.
   * @param event The event.
   */
  public onDeleteAnnotation(event: AnnotationEvent) {
    console.log('onDeleteAnnotation');
    const annotations = [...this._annotations$.value];
    const i = annotations.findIndex((a) => a.id === event.annotation.id);
    if (i > -1) {
      annotations.splice(i, 1);
      this._annotations$.next(annotations);
    }
  }
}
