import { Component, OnInit } from '@angular/core';
import { AssertedChronotope } from 'projects/myrmidon/cadmus-refs-asserted-chronotope/src/lib/asserted-chronotope/asserted-chronotope.component';

@Component({
  selector: 'app-asserted-chronotope-pg',
  templateUrl: './asserted-chronotope-pg.component.html',
  styleUrls: ['./asserted-chronotope-pg.component.css'],
})
export class AssertedChronotopePgComponent implements OnInit {
  public initialChronotope?: AssertedChronotope;
  public chronotope?: AssertedChronotope;

  constructor() {}

  ngOnInit(): void {
    this.initialChronotope = {
      place: {
        value: 'Rome',
        assertion: {
          rank: 2,
        },
      },
      date: {
        a: {
          value: 123,
        },
      },
    };
  }

  public onChronotopeChange(chronotope?: AssertedChronotope): void {
    this.chronotope = chronotope;
  }

  public reset(): void {
    // this.initialChronotope = undefined;
    this.initialChronotope = {};
  }
}
