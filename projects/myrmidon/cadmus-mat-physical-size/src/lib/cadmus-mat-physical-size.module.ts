import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PhysicalDimensionComponent } from './components/physical-dimension/physical-dimension.component';
import { PhysicalSizeComponent } from './components/physical-size/physical-size.component';
import { PhysicalSizePipe } from './components/physical-size.pipe';

@NgModule({
  declarations: [PhysicalDimensionComponent, PhysicalSizeComponent, PhysicalSizePipe],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // material
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
  ],
  exports: [PhysicalDimensionComponent, PhysicalSizeComponent, PhysicalSizePipe],
})
export class CadmusMatPhysicalSizeModule {}
