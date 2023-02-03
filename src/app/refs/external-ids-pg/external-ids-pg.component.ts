import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { ExternalId } from 'projects/myrmidon/cadmus-refs-external-ids/src/public-api';

@Component({
  selector: 'app-external-ids-pg',
  templateUrl: './external-ids-pg.component.html',
  styleUrls: ['./external-ids-pg.component.css'],
})
export class ExternalIdsPgComponent implements OnInit {
  public hasRank: FormControl;

  public ids?: ExternalId[];
  public scopeEntries: ThesaurusEntry[];
  public tagEntries: ThesaurusEntry[];

  constructor(formBuilder: FormBuilder) {
    this.hasRank = formBuilder.control(false);

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

    this.ids = [
      {
        value: 'http://some-resources/alpha',
      },
    ];
  }

  ngOnInit(): void {}

  public onIdsChange(ids: ExternalId[]): void {
    this.ids = ids;
  }
}
