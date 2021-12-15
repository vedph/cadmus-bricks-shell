import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { CadmusCoreModule } from '@myrmidon/cadmus-core';

import { DatationComponent } from './datation/datation.component';
import { HistoricalDateComponent } from './historical-date/historical-date.component';

@NgModule({
  declarations: [DatationComponent, HistoricalDateComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // material
    MatButtonModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSlideToggleModule,
    // Cadmus
    CadmusCoreModule,
  ],
  exports: [DatationComponent, HistoricalDateComponent],
})
export class CadmusRefsHistoricalDateModule {}
