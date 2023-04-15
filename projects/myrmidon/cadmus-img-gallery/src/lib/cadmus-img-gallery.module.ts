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
import { CadmusImgAnnotatorModule } from '@myrmidon/cadmus-img-annotator';
import { CadmusUiCustomActionBarModule } from '@myrmidon/cadmus-ui-custom-action-bar';

import { GalleryFilterComponent } from './components/gallery-filter/gallery-filter.component';
import { GalleryListComponent } from './components/gallery-list/gallery-list.component';
import { GalleryImgAnnotatorComponent } from './components/gallery-img-annotator/gallery-img-annotator.component';

@NgModule({
  declarations: [
    GalleryFilterComponent,
    GalleryListComponent,
    GalleryImgAnnotatorComponent,
  ],
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
    // myrmex
    NgToolsModule,
    // Cadmus
    CadmusCoreModule,
    CadmusImgAnnotatorModule,
    CadmusUiCustomActionBarModule
  ],
  exports: [
    GalleryFilterComponent,
    GalleryListComponent,
    // for image annotator directive
    GalleryImgAnnotatorComponent,
  ],
})
export class CadmusImgGalleryModule {}
