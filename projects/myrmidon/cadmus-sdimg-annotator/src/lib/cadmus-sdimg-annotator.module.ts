import { NgModule } from '@angular/core';

import { CadmusImgAnnotatorModule } from '@myrmidon/cadmus-img-annotator';

import { SdImgAnnotatorDirective } from './directives/sd-img-annotator.directive';

@NgModule({
  declarations: [SdImgAnnotatorDirective],
  imports: [CadmusImgAnnotatorModule],
  exports: [SdImgAnnotatorDirective],
})
export class CadmusSdimgAnnotatorModule {}
