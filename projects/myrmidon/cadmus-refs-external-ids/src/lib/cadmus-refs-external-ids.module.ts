import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { CadmusCoreModule } from '@myrmidon/cadmus-core';

import { ExternalIdsComponent } from './external-ids/external-ids.component';

@NgModule({
  declarations: [ExternalIdsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // material
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    // Cadmus
    CadmusCoreModule,
  ],
  exports: [ExternalIdsComponent],
})
export class CadmusRefsExternalIdsModule {}
