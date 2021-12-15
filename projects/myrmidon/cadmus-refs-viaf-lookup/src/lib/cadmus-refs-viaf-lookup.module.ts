import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { CadmusRefsLookupModule } from '@myrmidon/cadmus-refs-lookup';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CadmusMaterialModule,
    CadmusRefsLookupModule
  ],
  exports: [],
})
export class CadmusRefsViafLookupModule {}
