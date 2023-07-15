import { Component, OnInit } from '@angular/core';

import {
  HistoricalDate,
  HistoricalDateModel,
} from 'projects/myrmidon/cadmus-refs-historical-date/src/public-api';

@Component({
  selector: 'app-historical-date-pg',
  templateUrl: './historical-date-pg.component.html',
  styleUrls: ['./historical-date-pg.component.css'],
})
export class HistoricalDatePgComponent implements OnInit {
  public date?: HistoricalDateModel;

  constructor() {}

  ngOnInit(): void {
    this.date = HistoricalDate.parse('c.12 may 23 BC? {a hint}')!;
  }

  public onDateChange(date?: HistoricalDateModel): void {
    this.date = date;
  }
}
