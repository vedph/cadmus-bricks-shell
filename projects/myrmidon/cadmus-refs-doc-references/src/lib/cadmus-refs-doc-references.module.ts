import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { CadmusCoreModule } from '@myrmidon/cadmus-core';

import { DocReferencesComponent } from './doc-references/doc-references.component';

@NgModule({
  declarations: [
    DocReferencesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // material
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    // Cadmus
    CadmusCoreModule,
  ],
  exports: [
    DocReferencesComponent
  ],
})
export class CadmusRefsDocReferencesModule {}
