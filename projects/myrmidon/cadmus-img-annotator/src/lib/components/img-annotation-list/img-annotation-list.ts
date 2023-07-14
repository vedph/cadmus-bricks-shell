import { BehaviorSubject, Observable, take } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import {
  Annotation,
  AnnotationEvent,
} from '../../directives/img-annotator.directive';

/**
 * An annotation included in a list. Each annotation is paired
 * with custom payload data, edited in a dialog using as content
 * the component specified by editorComponent.
 */
export interface ListAnnotation<T> {
  id: string;
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
   * Deselect the selected annotation if any.
   */
  private deselectAnnotation(): void {
    if (!this._selectedAnnotation$.value) {
      return;
    }
    // deselect in Annotorious and also delete if it was newly added
    // (user canceled the editor dialog)
    this.annotator?.cancelSelected();
    if (this._currentIsNew) {
      this.annotator?.removeAnnotation(this._selectedAnnotation$.value.value);
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
    this.annotator?.updateSelected(annotation.value, true);
    // (local list will be updated on create event)
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
            this.annotator?.removeAnnotation(
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
    this._currentIsNew = true;
    this._selectedAnnotation$.next({ id: annotation.id!, value: annotation });
    this.editSelectedAnnotation();
  }

  /**
   * Handle the Annotorious select event.
   * @param annotation The annotation.
   */
  public onSelectAnnotation(annotation: Annotation) {
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
      this.annotator?.cancelSelected();
    } else {
      this._selectedAnnotation$.next(this._annotations$.value[index]);
      this.annotator?.selectAnnotation(this._selectedAnnotation$.value!.id);
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
    this._annotations$.next([
      ...this._annotations$.value,
      {
        id: event.annotation.id!,
        value: event.annotation,
        // no payload, it's new
      },
    ]);
  }

  /**
   * Handle the Annotorious update event.
   * @param event The event.
   */
  public onUpdateAnnotation(event: AnnotationEvent) {
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
    const annotations = [...this._annotations$.value];
    const i = annotations.findIndex((a) => a.id === event.annotation.id);
    if (i > -1) {
      annotations.splice(i, 1);
      this._annotations$.next(annotations);
    }
  }
}