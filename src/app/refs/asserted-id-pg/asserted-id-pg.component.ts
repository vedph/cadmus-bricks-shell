import { Component, OnInit } from '@angular/core';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { AssertedId } from 'projects/myrmidon/cadmus-refs-asserted-ids/src/public-api';

@Component({
  selector: 'app-asserted-id-pg',
  templateUrl: './asserted-id-pg.component.html',
  styleUrls: ['./asserted-id-pg.component.css'],
})
export class AssertedIdPgComponent implements OnInit {
  public id?: AssertedId;
  public refTypeEntries: ThesaurusEntry[];
  public refTagEntries: ThesaurusEntry[];

  constructor() {
    this.refTypeEntries = [
      {
        id: 'book',
        value: 'book'
      },
      {
        id: 'ms',
        value: 'manuscript'
      },
    ];
    this.refTagEntries = [
      {
        id: 'a',
        value: 'alpha'
      },
      {
        id: 'b',
        value: 'beta'
      },
      {
        id: '-',
        value: '---'
      },
    ];
  }

  ngOnInit(): void {}

  public onIdChange(id: AssertedId | undefined): void {
    this.id = id;
  }
}
