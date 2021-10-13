import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CadmusCoreModule } from '@myrmidon/cadmus-core';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';

import { DatationComponent } from './datation/datation.component';
import { HistoricalDateComponent } from './historical-date/historical-date.component';

@NgModule({
  declarations: [DatationComponent, HistoricalDateComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CadmusCoreModule,
    CadmusMaterialModule,
  ],
  exports: [DatationComponent, HistoricalDateComponent],
})
export class CadmusRefsHistoricalDateModule {}
