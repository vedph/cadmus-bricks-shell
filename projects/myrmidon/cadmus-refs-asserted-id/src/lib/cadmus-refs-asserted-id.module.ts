import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CadmusCoreModule } from '@myrmidon/cadmus-core';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { CadmusRefsAssertionModule } from '@myrmidon/cadmus-refs-assertion';
import { CadmusRefsDocReferencesModule } from '@myrmidon/cadmus-refs-doc-references';

import { AssertedIdComponent } from './asserted-id/asserted-id.component';

@NgModule({
  declarations: [
    AssertedIdComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CadmusCoreModule,
    CadmusMaterialModule,
    CadmusRefsDocReferencesModule,
    CadmusRefsAssertionModule
  ],
  exports: [AssertedIdComponent],
})
export class CadmusRefsAssertedIdModule {}
