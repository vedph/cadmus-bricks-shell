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

  ngOnInit(): void {}

  public onChronotopeChange(chronotope?: AssertedChronotope): void {
    this.chronotope = chronotope;
  }
}
