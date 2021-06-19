import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { PersonNameComponent } from './person-name/person-name.component';

@NgModule({
  declarations: [
    PersonNameComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CadmusMaterialModule,
  ],
  exports: [
    PersonNameComponent
  ],
})
export class CadmusProsopaPersonNameModule {}
