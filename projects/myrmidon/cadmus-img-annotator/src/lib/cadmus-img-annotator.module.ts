import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { ImgAnnotatorDirective } from './directives/img-annotator.directive';
import { ImgAnnotationListComponent } from './components/img-annotation-list/img-annotation-list.component';

@NgModule({
  declarations: [ImgAnnotatorDirective, ImgAnnotationListComponent],
  imports: [
    MatButtonModule,
    MatDialogModule,
  ],
  exports: [ImgAnnotatorDirective, ImgAnnotationListComponent],
})
export class CadmusImgAnnotatorModule {}
