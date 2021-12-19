import { Component, OnInit } from '@angular/core';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { ExternalId } from 'projects/myrmidon/cadmus-refs-external-ids/src/public-api';

@Component({
  selector: 'app-external-ids-pg',
  templateUrl: './external-ids-pg.component.html',
  styleUrls: ['./external-ids-pg.component.css'],
})
export class ExternalIdsPgComponent implements OnInit {
  public ids: ExternalId[] | undefined;
  public scopeEntries: ThesaurusEntry[];
  public tagEntries: ThesaurusEntry[];

  constructor() {
    this.scopeEntries = [
      {
        id: 'red',
        value: 'red',
      },
      {
        id: 'green',
        value: 'green',
      },
      {
        id: 'blue',
        value: 'blue',
      },
    ];

    this.tagEntries = [
      {
        id: 'alpha',
        value: 'alpha'
      },
      {
        id: 'beta',
        value: 'beta'
      }
    ];
  }

  ngOnInit(): void {}

  public onIdsChange(ids: ExternalId[]): void {
    this.ids = ids;
  }
}
