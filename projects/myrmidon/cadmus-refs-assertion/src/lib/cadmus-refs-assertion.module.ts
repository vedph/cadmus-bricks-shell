import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { CadmusCoreModule } from '@myrmidon/cadmus-core';
import { CadmusRefsDocReferencesModule } from '@myrmidon/cadmus-refs-doc-references';

import { AssertionComponent } from './assertion/assertion.component';

@NgModule({
  declarations: [AssertionComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // material
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    // Cadmus
    CadmusCoreModule,
    CadmusRefsDocReferencesModule,
  ],
  exports: [AssertionComponent],
})
export class CadmusRefsAssertionModule {}
