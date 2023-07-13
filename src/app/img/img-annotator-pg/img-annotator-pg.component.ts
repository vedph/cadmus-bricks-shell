import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import {
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatDialog,
  MatDialogConfig,
} from '@angular/material/dialog';
import { Subscription, take } from 'rxjs';
import {
  AnnotationEvent,
  AnnotoriousConfig,
  Annotation,
} from 'projects/myrmidon/cadmus-img-annotator/src/public-api';

import { EditAnnotationDialogComponent } from '../edit-annotation-dialog/edit-annotation-dialog.component';

@Component({
  selector: 'app-img-annotator-pg',
  templateUrl: './img-annotator-pg.component.html',
  styleUrls: ['./img-annotator-pg.component.css'],
})
export class ImgAnnotatorPgComponent implements OnInit, OnDestroy {
  private _sub?: Subscription;
  private _annotator?: any;
  private _newSelection?: boolean;

  public message?: string;
  public config?: AnnotoriousConfig = {
    disableEditor: true,
  };
  public headless: FormControl<boolean>;
  public selectedAnnotation?: Annotation;
  public annotations: Annotation[];
  public selectedAnnotationIndex: number;

  constructor(
    formBuilder: FormBuilder,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DEFAULT_OPTIONS) public dlgConfig: MatDialogConfig
  ) {
    this.headless = formBuilder.control(true, { nonNullable: true });
    this.annotations = [];
    this.selectedAnnotationIndex = -1;
  }

  ngOnInit(): void {
    this._sub = this.headless.valueChanges.subscribe((_) => {
      this.config = {
        disableEditor: this.headless.value,
      };
    });
  }

  ngOnDestroy(): void {
    this._sub?.unsubscribe();
  }

  private deselectAnnotation(): void {
    if (!this.selectedAnnotation) {
      return;
    }
    this._annotator?.cancelSelected();
    if (this._newSelection) {
      this._annotator?.removeAnnotation(this.selectedAnnotation);
    }
    this.selectedAnnotation = undefined;
    this.selectedAnnotationIndex = -1;
    this._newSelection = false;
  }

  private saveAnnotation(annotation: Annotation): void {
    this._annotator?.updateSelected(annotation, true);
    this._annotator?.cancelSelected();
    this.deselectAnnotation();
  }

  public onAnnotatorInit(annotator: any) {
    this._annotator = annotator;
  }

  private editSelectedAnnotation(): void {
    // edit
    const dialogRef = this.dialog.open(EditAnnotationDialogComponent, {
      ...this.dlgConfig,
      data: this.selectedAnnotation,
    });
    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        if (result) {
          this.saveAnnotation(result);
        } else {
          if (this._newSelection) {
            this._annotator?.removeAnnotation(this.selectedAnnotation);
            this._newSelection = false;
          }
        }
        this.selectedAnnotation = result;
      });
  }

  /**
   * Handle the creation of a new selection by opening the annotation
   * editor and updating the received annotation if saved, or removing it
   * if canceled.
   * @param annotation The annotation.
   */
  public onCreateSelection(annotation: Annotation) {
    this._newSelection = true;
    if (!annotation.body) {
      annotation.body = [];
    }
    this.selectedAnnotation = annotation;
    this.editSelectedAnnotation();
  }

  public onSelectAnnotation(selection: Annotation) {
    this.message = '_SELECTED:\n' + JSON.stringify(selection, null, 2);
    this.selectedAnnotation = selection;
    this.selectedAnnotationIndex = this.annotations.findIndex(
      (a) => a.id === selection.id
    );
  }

  public onCancelSelected(selection: Annotation) {
    this._newSelection = false;
    this.deselectAnnotation();
  }

  /**
   * Edit the annotation at the specified index.
   * @param index The annotation index.
   */
  public editAnnotation(index: number): void {
    this.selectedAnnotation = this.annotations[index];
    this.selectedAnnotationIndex = index;
    this.editSelectedAnnotation();
  }

  /**
   * Select the annotation at the specified index.
   * @param index The annotation index.
   */
  public selectAnnotation(index: number): void {
    this.selectedAnnotationIndex = index;
    if (index === -1) {
      this.selectedAnnotation = undefined;
      this._annotator?.cancelSelected();
    } else {
      this.selectedAnnotation = this.annotations[index];
      this._annotator?.selectAnnotation(this.annotations[index].id);
    }
  }

  /**
   * Remove the annotation at the specified index.
   * @param index The annotation index.
   */
  public removeAnnotation(index: number): void {
    if (this.selectedAnnotationIndex === index) {
      this.deselectAnnotation();
    }
    const annotation = this.annotations[index];
    this.annotations.splice(index, 1);
    this._annotator?.removeAnnotation(annotation.id);
  }

  public onCreateAnnotation(event: AnnotationEvent) {
    this.message = 'CREATED:\n' + JSON.stringify(event.annotation, null, 2);
    const i = this.annotations.findIndex((a) => a.id === event.annotation.id);
    if (i > -1) {
      this.annotations[i] = event.annotation;
    } else {
      this.annotations.push(event.annotation);
    }
  }

  public onUpdateAnnotation(event: AnnotationEvent) {
    this.message = 'UPDATED:\n' + JSON.stringify(event.annotation, null, 2);
    const i = this.annotations.findIndex((a) => a.id === event.annotation.id);
    if (i > -1) {
      this.annotations[i] = event.annotation;
    }
  }

  public onDeleteAnnotation(event: AnnotationEvent) {
    this.message = 'DELETED:\n' + JSON.stringify(event.annotation, null, 2);
    const i = this.annotations.findIndex((a) => a.id === event.annotation.id);
    if (i > -1) {
      this.annotations.splice(i, 1);
    }
  }
}
