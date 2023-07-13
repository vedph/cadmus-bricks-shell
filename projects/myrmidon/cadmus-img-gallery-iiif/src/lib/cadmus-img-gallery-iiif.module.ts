import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { CadmusImgGalleryModule } from '@myrmidon/cadmus-img-gallery';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    // cadmus
    CadmusImgGalleryModule
  ],
  exports: [],
})
export class CadmusImgGalleryIiifModule {}
