import { Component, OnInit } from '@angular/core';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { DocReference } from '@myrmidon/cadmus-refs-doc-references';

@Component({
  selector: 'app-doc-references-pg',
  templateUrl: './doc-references-pg.component.html',
  styleUrls: ['./doc-references-pg.component.css'],
})
export class DocReferencesPgComponent implements OnInit {
  public initialReferences: DocReference[];
  public references: DocReference[];
  public typeEntries: ThesaurusEntry[];

  constructor() {
    this.initialReferences = [];
    this.references = [];
    this.typeEntries = [
      {
        id: 'text',
        value: 'text',
      },
      {
        id: 'book',
        value: 'book',
      },
      {
        id: 'biblio',
        value: 'bibliography',
      },
      {
        id: 'ms',
        value: 'manuscript',
      },
      {
        id: 'doc',
        value: 'archive document',
      },
    ];
  }

  ngOnInit(): void {}

  public onReferencesChange(model: DocReference[]): void {
    this.references = model;
  }
}
