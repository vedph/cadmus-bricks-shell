import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CadmusCoreModule } from '@myrmidon/cadmus-core';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { CadmusRefsDocReferencesModule } from '@myrmidon/cadmus-refs-doc-references';
import { DecoratedIdsComponent } from './decorated-ids/decorated-ids.component';

@NgModule({
  declarations: [DecoratedIdsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CadmusCoreModule,
    CadmusMaterialModule,
    CadmusRefsDocReferencesModule
  ],
  exports: [DecoratedIdsComponent],
})
export class CadmusRefsDecoratedIdsModule {}
