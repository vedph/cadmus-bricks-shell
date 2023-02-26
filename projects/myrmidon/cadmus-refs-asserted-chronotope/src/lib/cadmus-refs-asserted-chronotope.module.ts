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

import { NgMatToolsModule } from '@myrmidon/ng-mat-tools';
import { NgToolsModule } from '@myrmidon/ng-tools';
import { CadmusCoreModule } from '@myrmidon/cadmus-core';
import { CadmusRefsAssertionModule } from '@myrmidon/cadmus-refs-assertion';
import { CadmusRefsDocReferencesModule } from '@myrmidon/cadmus-refs-doc-references';
import { CadmusRefsHistoricalDateModule } from '@myrmidon/cadmus-refs-historical-date';

import { AssertedChronotopeComponent } from './asserted-chronotope/asserted-chronotope.component';
import { AssertedChronotopeSetComponent } from './asserted-chronotope-set/asserted-chronotope-set.component';
import { AssertedChronotopesPipe } from './asserted-chronotopes.pipe';

@NgModule({
  declarations: [
    AssertedChronotopeComponent,
    AssertedChronotopeSetComponent,
    AssertedChronotopesPipe
  ],
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
    // tools
    NgToolsModule,
    NgMatToolsModule,
    // Cadmus
    CadmusCoreModule,
    CadmusRefsDocReferencesModule,
    CadmusRefsAssertionModule,
    CadmusRefsHistoricalDateModule,
  ],
  exports: [
    AssertedChronotopeComponent,
    AssertedChronotopeSetComponent,
    AssertedChronotopesPipe
  ],
})
export class CadmusRefsAssertedChronotopeModule {}
