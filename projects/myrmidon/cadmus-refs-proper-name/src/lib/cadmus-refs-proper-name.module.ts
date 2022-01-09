import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { CadmusCoreModule } from '@myrmidon/cadmus-core';
import { CadmusRefsAssertionModule } from '@myrmidon/cadmus-refs-assertion';

import { ProperNameComponent } from './proper-name/proper-name.component';
import { CadmusProperNamePipe } from './cadmus-proper-name.pipe';

@NgModule({
  declarations: [ProperNameComponent, CadmusProperNamePipe],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // material
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    // Cadmus
    CadmusCoreModule,
    CadmusRefsAssertionModule,
  ],
  exports: [ProperNameComponent, CadmusProperNamePipe],
})
export class CadmusRefsProperNameModule {}
