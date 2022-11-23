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

import { MarkdownModule } from 'ngx-markdown';
import { NgMatToolsModule } from '@myrmidon/ng-mat-tools';

import { NoteSetComponent } from './note-set/note-set.component';

@NgModule({
  declarations: [NoteSetComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // vendor
    NgMatToolsModule,
    MarkdownModule,
    // material
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule,
  ],
  exports: [NoteSetComponent],
})
export class CadmusUiNoteSetModule {}
