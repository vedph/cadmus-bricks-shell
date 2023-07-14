import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ImgAnnotatorDirective } from './directives/img-annotator.directive';
import { ObjectToStringPipe } from './pipes/object-to-string.pipe';
import { ImgAnnotatorToolbarComponent } from './components/img-annotator-toolbar/img-annotator-toolbar.component';

@NgModule({
  declarations: [
    ImgAnnotatorDirective,
    ObjectToStringPipe,
    ImgAnnotatorToolbarComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // material
    MatButtonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatIconModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule,
  ],
  exports: [
    ImgAnnotatorDirective,
    ObjectToStringPipe,
    ImgAnnotatorToolbarComponent,
  ],
})
export class CadmusImgAnnotatorModule {}
