import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { ImgAnnotatorDirective } from './directives/img-annotator.directive';
import { ImgAnnotationListComponent } from './components/img-annotation-list/img-annotation-list.component';
import { ObjectToStringPipe } from './pipes/object-to-string.pipe';

@NgModule({
  declarations: [
    ImgAnnotatorDirective,
    ImgAnnotationListComponent,
    ObjectToStringPipe,
  ],
  imports: [MatButtonModule, MatDialogModule, MatIconModule],
  exports: [
    ImgAnnotatorDirective,
    ImgAnnotationListComponent,
    ObjectToStringPipe,
  ],
})
export class CadmusImgAnnotatorModule {}
