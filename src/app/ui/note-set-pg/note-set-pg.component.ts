import { KeyValue } from '@angular/common';
import { Component } from '@angular/core';
import { NoteSet } from '@myrmidon/cadmus-ui-note-set';

@Component({
  selector: 'app-note-set-pg',
  templateUrl: './note-set-pg.component.html',
  styleUrls: ['./note-set-pg.component.css'],
})
export class NoteSetPgComponent {
  public set: NoteSet;
  public lastNoteSet?: string;

  constructor() {
    this.set = {
      definitions: [
        {
          key: 'a',
          label: 'alpha',
          markdown: true,
          required: true,
          maxLength: 200,
        },
        {
          key: 'b',
          label: 'beta',
        },
      ],
      notes: new Map<string, string | null>(),
    };
    this.set.notes!.set(
      'a',
      'This is a *Markdown* note!\nMax **200** characters.'
    );
    this.set.notes!.set('b', 'This is plain text note with no max length.');
  }

  public onNoteChange(note: KeyValue<string, string | null>): void {
    this.lastNoteSet = `${note.key}=${note.value}`;
    // this.set.notes?.set(note.key, note.value);
  }
}
