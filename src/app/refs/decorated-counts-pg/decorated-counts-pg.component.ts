import { Component, OnInit } from '@angular/core';
import { DecoratedCount } from 'projects/myrmidon/cadmus-refs-decorated-counts/src/public-api';

@Component({
  selector: 'app-decorated-counts-pg',
  templateUrl: './decorated-counts-pg.component.html',
  styleUrls: ['./decorated-counts-pg.component.css'],
})
export class DecoratedCountsPgComponent implements OnInit {
  public initialCounts: DecoratedCount[];
  public counts?: DecoratedCount[];

  constructor() {
    this.initialCounts = [];
  }

  ngOnInit(): void {}

  public onCountsChange(counts: DecoratedCount[]): void {
    this.counts = counts;
  }
}
