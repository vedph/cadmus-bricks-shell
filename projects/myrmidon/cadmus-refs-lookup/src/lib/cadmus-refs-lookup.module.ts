import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { RefLookupComponent } from './ref-lookup/ref-lookup.component';
import { AutoFocusDirective } from './auto-focus.directive';

@NgModule({
  declarations: [RefLookupComponent, AutoFocusDirective],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CadmusMaterialModule,
  ],
  exports: [RefLookupComponent, AutoFocusDirective],
})
export class CadmusRefsLookupModule {}
