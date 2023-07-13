import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Annotation } from 'projects/myrmidon/cadmus-img-annotator/src/public-api';

/**
 * A dialog wrapping an annotation editor. This just wires the received
 * data with the editor.
 */
@Component({
  selector: 'app-edit-annotation-dialog',
  templateUrl: './edit-annotation-dialog.component.html',
  styleUrls: ['./edit-annotation-dialog.component.css'],
})
export class EditAnnotationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EditAnnotationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Annotation
  ) {}

  onCloseClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(selection: Annotation): void {
    this.dialogRef.close(selection);
  }
}
