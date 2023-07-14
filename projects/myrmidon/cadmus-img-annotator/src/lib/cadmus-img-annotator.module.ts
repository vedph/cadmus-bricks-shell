import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { ImgAnnotatorDirective } from './directives/img-annotator.directive';
import { ObjectToStringPipe } from './pipes/object-to-string.pipe';

@NgModule({
  declarations: [ImgAnnotatorDirective, ObjectToStringPipe],
  imports: [
    CommonModule,
    // material
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatIconModule,
  ],
  exports: [ImgAnnotatorDirective, ObjectToStringPipe],
})
export class CadmusImgAnnotatorModule {}
