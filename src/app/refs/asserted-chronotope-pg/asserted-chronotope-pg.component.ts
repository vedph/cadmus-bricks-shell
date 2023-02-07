import { Component, OnInit } from '@angular/core';
import { AssertedChronotope } from 'projects/myrmidon/cadmus-refs-asserted-chronotope/src/lib/asserted-chronotope/asserted-chronotope.component';

@Component({
  selector: 'app-asserted-chronotope-pg',
  templateUrl: './asserted-chronotope-pg.component.html',
  styleUrls: ['./asserted-chronotope-pg.component.css'],
})
export class AssertedChronotopePgComponent implements OnInit {
  public chronotope?: AssertedChronotope;

  constructor() {}

  ngOnInit(): void {
    this.chronotope = {
      place: {
        value: 'Rome',
        assertion: {
          rank: 2,
          references: [
            {
              type: 'biblio',
              citation: 'Rossi 1963',
            },
          ],
        },
      },
      date: {
        a: {
          value: 123,
        },
        assertion: {
          rank: 1,
          references: [
            {
              type: 'CIL',
              citation: '1.23'
            }
          ]
        }
      },
    };
  }

  public onChronotopeChange(chronotope?: AssertedChronotope): void {
    this.chronotope = chronotope;
  }

  public reset(): void {
    this.chronotope = {};
  }
}
