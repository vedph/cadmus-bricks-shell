import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { CadmusProsopaPersonNameModule } from '@myrmidon/cadmus-prosopa-person-name';
import { CadmusRefsDecoratedIdsModule } from '@myrmidon/cadmus-refs-decorated-ids';
import { CadmusRefsDocReferencesModule } from '@myrmidon/cadmus-refs-doc-references';
import { CitedPersonComponent } from './cited-person/cited-person.component';

@NgModule({
  declarations: [
    CitedPersonComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CadmusMaterialModule,
    CadmusRefsDocReferencesModule,
    CadmusRefsDecoratedIdsModule,
    CadmusProsopaPersonNameModule
  ],
  exports: [CitedPersonComponent],
})
export class CadmusProsopaCitedPersonModule {}
