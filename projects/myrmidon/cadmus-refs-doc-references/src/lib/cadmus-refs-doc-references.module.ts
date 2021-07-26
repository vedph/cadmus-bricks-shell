import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CadmusCoreModule } from '@myrmidon/cadmus-core';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';

import { DocReferencesComponent } from './doc-references/doc-references.component';

@NgModule({
  declarations: [
    DocReferencesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CadmusCoreModule,
    CadmusMaterialModule,
  ],
  exports: [
    DocReferencesComponent
  ],
})
export class CadmusRefsDocReferencesModule {}
