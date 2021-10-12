import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CadmusCoreModule } from '@myrmidon/cadmus-core';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';

import { ProperNameComponent } from './proper-name/proper-name.component';

@NgModule({
  declarations: [ProperNameComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CadmusCoreModule,
    CadmusMaterialModule
  ],
  exports: [ProperNameComponent],
})
export class CadmusRefsProperNameModule {}
