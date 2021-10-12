import { Component, OnInit } from '@angular/core';

import { Assertion } from 'projects/myrmidon/cadmus-refs-assertion/src/public-api';

@Component({
  selector: 'app-assertion-pg',
  templateUrl: './assertion-pg.component.html',
  styleUrls: ['./assertion-pg.component.css'],
})
export class AssertionPgComponent implements OnInit {
  public initialAssertion: Assertion | undefined;
  public assertion: Assertion | undefined;

  constructor() {}

  ngOnInit(): void {}

  public onAssertionChange(assertion: Assertion | undefined): void {
    this.assertion = assertion;
  }
}
