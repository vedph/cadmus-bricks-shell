import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { NgToolsModule } from '@myrmidon/ng-tools';
import { CadmusCoreModule } from '@myrmidon/cadmus-core';
import { CadmusSdimgAnnotatorModule } from '@myrmidon/cadmus-sdimg-annotator';

import { GallerySdimgAnnotatorComponent } from './components/gallery-sdimg-annotator/gallery-sdimg-annotator.component';

@NgModule({
  declarations: [GallerySdimgAnnotatorComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgOptimizedImage,
    // material
    MatButtonModule,
    MatButtonToggleModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatSelectModule,
    MatTooltipModule,
    NgToolsModule,
    // Cadmus
    CadmusCoreModule,
    CadmusSdimgAnnotatorModule,
  ],
  exports: [GallerySdimgAnnotatorComponent],
})
export class CadmusSdimgGalleryModule {}
