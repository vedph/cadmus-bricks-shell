import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CadmusImgGalleryModule } from '@myrmidon/cadmus-img-gallery';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // cadmus
    CadmusImgGalleryModule
  ],
  exports: [],
})
export class CadmusImgGalleryIiifModule {}
