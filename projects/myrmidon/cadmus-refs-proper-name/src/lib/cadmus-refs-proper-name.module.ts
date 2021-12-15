import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CadmusCoreModule } from '@myrmidon/cadmus-core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { ProperNameComponent } from './proper-name/proper-name.component';

@NgModule({
  declarations: [ProperNameComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // material
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    // Cadmus
    CadmusCoreModule,
  ],
  exports: [ProperNameComponent],
})
export class CadmusRefsProperNameModule {}
