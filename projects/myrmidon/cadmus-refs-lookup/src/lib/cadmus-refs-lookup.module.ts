import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CadmusMaterialModule } from '@myrmidon/cadmus-material';

import { RefLookupComponent } from './ref-lookup/ref-lookup.component';
import { AutoFocusDirective } from './auto-focus.directive';
import { RefLookupOptionsComponent } from './ref-lookup-options/ref-lookup-options.component';

@NgModule({
  declarations: [
    RefLookupComponent,
    AutoFocusDirective,
    RefLookupOptionsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CadmusMaterialModule,
  ],
  exports: [RefLookupComponent, AutoFocusDirective, RefLookupOptionsComponent],
})
export class CadmusRefsLookupModule {}
