import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CadmusCoreModule } from '@myrmidon/cadmus-core';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { CadmusRefsAssertionModule } from '@myrmidon/cadmus-refs-assertion';
import { CadmusRefsDocReferencesModule } from '@myrmidon/cadmus-refs-doc-references';
import { CadmusRefsHistoricalDateModule } from '@myrmidon/cadmus-refs-historical-date';
import { ChronotopeComponent } from './chronotope/chronotope.component';

@NgModule({
  declarations: [
    ChronotopeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CadmusCoreModule,
    CadmusMaterialModule,
    CadmusRefsDocReferencesModule,
    CadmusRefsAssertionModule,
    CadmusRefsHistoricalDateModule
  ],
  exports: [ChronotopeComponent],
})
export class CadmusRefsChronotopeModule {}
