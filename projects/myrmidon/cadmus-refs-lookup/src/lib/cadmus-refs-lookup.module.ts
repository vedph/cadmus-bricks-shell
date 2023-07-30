import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { RefLookupComponent } from './ref-lookup/ref-lookup.component';
import { AutoFocusDirective } from './auto-focus.directive';
import { RefLookupOptionsComponent } from './ref-lookup-options/ref-lookup-options.component';
import { RefLookupSetComponent } from './ref-lookup-set/ref-lookup-set.component';

@NgModule({
  declarations: [
    RefLookupComponent,
    AutoFocusDirective,
    RefLookupOptionsComponent,
    RefLookupSetComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // material
    MatAutocompleteModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  exports: [
    RefLookupComponent,
    AutoFocusDirective,
    RefLookupOptionsComponent,
    RefLookupSetComponent,
  ],
})
export class CadmusRefsLookupModule {}
