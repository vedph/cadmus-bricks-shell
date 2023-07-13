import { Component, Inject, Input } from '@angular/core';
import {
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatDialog,
  MatDialogConfig,
} from '@angular/material/dialog';
import { take } from 'rxjs';

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

@Component({
  selector: 'cadmus-img-img-annotation-list',
  templateUrl: './img-annotation-list.component.html',
  styleUrls: ['./img-annotation-list.component.css'],
})
export class ImgAnnotationListComponent {
  private _currentIsNew?: boolean;

  /**
   * The annotator object as received from Annotorious.
   */
  @Input({ required: true })
  public annotator?: any;

  /**
   * The component used to edit a ListAnnotation. Pass the component
   * class, e.g. [editorComponent]="MyEditorComponent".
   */
  @Input({ required: true })
  public editorComponent?: any;

  /**
   * The function used to build a string from a list annotation object,
   * summarizing its content appropriately.
   */
  @Input()
  public annotationToString: (object: ListAnnotation<any>) => string | null;

  public selectedIndex: number;
  public selectedAnnotation?: Annotation;
  public annotations: ListAnnotation<any>[];

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DEFAULT_OPTIONS) public dlgConfig: MatDialogConfig
  ) {
    this.selectedIndex = -1;
    this.annotations = [];
    this.annotationToString = (a: ListAnnotation<any>) => {
      return a.value.body?.length ? a.value.body[0].value : a.id;
    };
  }

  /**
   * Un-select the selected annotation if any.
   */
  private deselectAnnotation(): void {
    if (!this.selectedAnnotation) {
      return;
    }
    // deselect in Annotorious and also delete if it was newly added
    // (user canceled the editor dialog)
    this.annotator?.cancelSelected();
    if (this._currentIsNew) {
      this.annotator?.removeAnnotation(this.selectedAnnotation);
    }
    this.selectedAnnotation = undefined;
    this.selectedIndex = -1;
    this._currentIsNew = false;
  }

  /**
   * Save the specified list annotation.
   * @param annotation The annotation.
   */
  private saveAnnotation(annotation: ListAnnotation<any>): void {
    // update in annotorious
    this.annotator?.updateSelected(annotation.value, true);
    // update in local list
    const i = this.annotations.findIndex((a) => a.id === annotation.id);
    if (i > -1) {
      this.annotations[i] = annotation;
    } else {
      this.annotations.push(annotation);
    }
    // reset current
    this.deselectAnnotation();
  }

  /**
   * Edit the selected annotation in the editor dialog.
   */
  private editSelectedAnnotation(): void {
    if (!this.selectedAnnotation) {
      return;
    }
    const payload = this.annotations.find(
      (a) => a.id === this.selectedAnnotation?.id
    )?.payload;

    // edit
    const dialogRef = this.dialog.open(this.editorComponent, {
      ...this.dlgConfig,
      data: {
        id: this.selectedAnnotation.id,
        value: this.selectedAnnotation,
        payload,
      },
    });
    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        // save on OK, else remove if was new
        if (result) {
          this.saveAnnotation(result);
        } else {
          if (this._currentIsNew) {
            this.annotator?.removeAnnotation(this.selectedAnnotation);
            this._currentIsNew = false;
          }
        }
        this.selectedAnnotation = result.annotation;
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
    this.selectedAnnotation = annotation;
    this.editSelectedAnnotation();
  }

  /**
   * Handle the Annotorious select event.
   * @param annotation The annotation.
   */
  public onSelectAnnotation(annotation: Annotation) {
    this.selectedAnnotation = annotation;
    this.selectedIndex = this.annotations.findIndex(
      (a) => a.id === annotation.id
    );
  }

  /**
   * Handle the Annotorious cancelSelected event.
   * @param annotation The annotation.
   */
  public onCancelSelected(annotation: Annotation) {
    this._currentIsNew = false;
    this.selectedAnnotation = undefined;
    this.selectedIndex = -1;
    this._currentIsNew = false;
  }

  /**
   * Edit the annotation at the specified index.
   * @param index The annotation index.
   */
  public editAnnotation(index: number): void {
    this.selectedAnnotation = this.annotations[index].value;
    this.selectedIndex = index;
    this.editSelectedAnnotation();
  }

  /**
   * Select the annotation at the specified index.
   * @param index The annotation index.
   */
  public selectAnnotation(index: number): void {
    this.selectedIndex = index;
    if (index === -1) {
      this.selectedAnnotation = undefined;
      this.annotator?.cancelSelected();
    } else {
      this.selectedAnnotation = this.annotations[index].value;
      this.annotator?.selectAnnotation(this.annotations[index].id);
    }
  }

  /**
   * Remove the annotation at the specified index.
   * @param index The annotation index.
   */
  public removeAnnotation(index: number): void {
    // deselect annotation before deleting it
    if (this.selectedIndex === index) {
      this.deselectAnnotation();
    }
    // remove from local and annotorious
    const annotation = this.annotations[index];
    this.annotations.splice(index, 1);
    this.annotator.removeAnnotation(annotation.id);
  }

  /**
   * Handle the Annotorious create event.
   * @param event The event.
   */
  public onCreateAnnotation(event: AnnotationEvent) {
    this.annotations.push({
      id: event.annotation.id!,
      value: event.annotation,
      // no payload, it's new
    });
  }

  /**
   * Handle the Annotorious update event.
   * @param event The event.
   */
  public onUpdateAnnotation(event: AnnotationEvent) {
    const i = this.annotations.findIndex((a) => a.id === event.annotation.id);
    if (i > -1) {
      // update value only
      this.annotations[i] = { ...this.annotations[i], value: event.annotation };
    }
  }

  /**
   * Handle the Annotorious delete event.
   * @param event The event.
   */
  public onDeleteAnnotation(event: AnnotationEvent) {
    const i = this.annotations.findIndex((a) => a.id === event.annotation.id);
    if (i > -1) {
      this.annotations.splice(i, 1);
    }
  }
}
