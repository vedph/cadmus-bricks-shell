import { Component, OnInit } from '@angular/core';
import { AssertedChronotope } from '@myrmidon/cadmus-refs-asserted-chronotope';

@Component({
  selector: 'app-asserted-chronotope-set-pg',
  templateUrl: './asserted-chronotope-set-pg.component.html',
  styleUrls: ['./asserted-chronotope-set-pg.component.css'],
})
export class AssertedChronotopeSetPgComponent implements OnInit {
  public chronotopes: AssertedChronotope[];

  constructor() {
    this.chronotopes = [{
      place: {
        value: 'Rome'
      }
    }];
  }

  ngOnInit(): void {}

  public onChronotopesChange(chronotopes: AssertedChronotope[]): void {
    this.chronotopes = chronotopes;
  }
}
