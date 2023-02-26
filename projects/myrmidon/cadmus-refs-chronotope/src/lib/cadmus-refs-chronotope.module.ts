import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { CadmusCoreModule } from '@myrmidon/cadmus-core';
import { CadmusRefsDocReferencesModule } from '@myrmidon/cadmus-refs-doc-references';
import { CadmusRefsHistoricalDateModule } from '@myrmidon/cadmus-refs-historical-date';

import { ChronotopeComponent } from './chronotope/chronotope.component';
import { ChronotopePipe } from './chronotope.pipe';

@NgModule({
  declarations: [ChronotopeComponent, ChronotopePipe],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // material
    MatButtonModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    // Cadmus
    CadmusCoreModule,
    CadmusRefsDocReferencesModule,
    CadmusRefsHistoricalDateModule,
  ],
  exports: [ChronotopeComponent, ChronotopePipe],
})
export class CadmusRefsChronotopeModule {}
