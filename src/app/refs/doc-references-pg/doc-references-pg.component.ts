import { Component, OnInit } from '@angular/core';
import { DocReference } from '@myrmidon/cadmus-core';

@Component({
  selector: 'app-doc-references-pg',
  templateUrl: './doc-references-pg.component.html',
  styleUrls: ['./doc-references-pg.component.css'],
})
export class DocReferencesPgComponent implements OnInit {
  public initialReferences: DocReference[];
  public references: DocReference[];

  constructor() {
    this.initialReferences = [];
    this.references = [];
  }

  ngOnInit(): void {}

  public onReferencesChange(model: DocReference[]): void {
    this.references = model;
  }
}
