import { Component, OnInit } from '@angular/core';

import { Chronotope } from 'projects/myrmidon/cadmus-refs-chronotope/src/public-api';

@Component({
  selector: 'app-chronotope-pg',
  templateUrl: './chronotope-pg.component.html',
  styleUrls: ['./chronotope-pg.component.css'],
})
export class ChronotopePgComponent implements OnInit {
  public chronotope?: Chronotope;

  constructor() {}

  ngOnInit(): void {
    this.chronotope = {
      place: 'Rome',
      date: {
        a: {
          value: 123,
          isApproximate: true,
        },
      },
    };
  }

  public onChronotopeChange(chronotope?: Chronotope): void {
    this.chronotope = chronotope;
  }
}
