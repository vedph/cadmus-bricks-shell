import { Component, OnInit } from '@angular/core';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';

import { Assertion } from 'projects/myrmidon/cadmus-refs-assertion/src/public-api';

@Component({
  selector: 'app-assertion-pg',
  templateUrl: './assertion-pg.component.html',
  styleUrls: ['./assertion-pg.component.css'],
})
export class AssertionPgComponent implements OnInit {
  public initialAssertion: Assertion | undefined;
  public assertion: Assertion | undefined;
  public refTypeEntries: ThesaurusEntry[];

  constructor() {
    this.refTypeEntries = [
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

  public onAssertionChange(assertion: Assertion | undefined): void {
    this.assertion = assertion;
  }
}
