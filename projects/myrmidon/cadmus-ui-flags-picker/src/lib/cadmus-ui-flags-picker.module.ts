import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { FlagsPickerComponent } from './flags-picker/flags-picker.component';

@NgModule({
  declarations: [
    FlagsPickerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CadmusMaterialModule
  ],
  exports: [FlagsPickerComponent],
})
export class CadmusUiFlagsPickerModule {}