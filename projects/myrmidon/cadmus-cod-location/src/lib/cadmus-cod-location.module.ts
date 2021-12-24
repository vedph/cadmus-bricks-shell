import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { CodLocationComponent } from './cod-location/cod-location.component';

@NgModule({
  declarations: [CodLocationComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // material
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  exports: [CodLocationComponent],
})
export class CadmusCodLocationModule {}
