import { Component, OnInit } from '@angular/core';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { DecoratedCount } from 'projects/myrmidon/cadmus-refs-decorated-counts/src/public-api';

@Component({
  selector: 'app-decorated-counts-pg',
  templateUrl: './decorated-counts-pg.component.html',
  styleUrls: ['./decorated-counts-pg.component.css'],
})
export class DecoratedCountsPgComponent implements OnInit {
  public initialCounts: DecoratedCount[];
  public counts?: DecoratedCount[];
  public idEntries: ThesaurusEntry[];

  constructor() {
    this.initialCounts = [];
    this.idEntries = [
      {
        id: 'sheets',
        value: 'sheets'
      },
      {
        id: 'g-sheets',
        value: 'guard sheets'
      },
    ];
  }

  ngOnInit(): void {}

  public onCountsChange(counts: DecoratedCount[]): void {
    this.counts = counts;
  }
}
