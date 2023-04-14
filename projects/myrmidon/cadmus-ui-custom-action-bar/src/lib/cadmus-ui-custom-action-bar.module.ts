import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { CustomActionBarComponent } from './custom-action-bar/custom-action-bar.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [CustomActionBarComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // material
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  exports: [CustomActionBarComponent],
})
export class CadmusUiCustomActionBarModule {}
