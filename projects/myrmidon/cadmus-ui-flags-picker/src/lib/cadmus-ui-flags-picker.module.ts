import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { FlagsPickerComponent } from './flags-picker/flags-picker.component';

@NgModule({
  declarations: [
    FlagsPickerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // material
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatIconModule
  ],
  exports: [FlagsPickerComponent],
})
export class CadmusUiFlagsPickerModule {}
