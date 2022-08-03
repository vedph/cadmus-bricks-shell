import { Component, OnInit } from '@angular/core';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { AssertedId } from '@myrmidon/cadmus-refs-asserted-id';

@Component({
  selector: 'app-asserted-ids-pg',
  templateUrl: './asserted-ids-pg.component.html',
  styleUrls: ['./asserted-ids-pg.component.css'],
})
export class AssertedIdsPgComponent implements OnInit {
  public initialIds: AssertedId[];
  public ids?: AssertedId[];
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
        value: 'alpha',
      },
      {
        id: 'beta',
        value: 'beta',
      },
    ];

    this.initialIds = [
      {
        value: 'http://some-resources/stuff/alpha',
        scope: 'some-resources.org'
      },
    ];
  }

  ngOnInit(): void {}

  public onIdsChange(ids: AssertedId[]): void {
    this.ids = ids;
  }
}
