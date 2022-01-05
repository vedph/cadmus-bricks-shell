import { Component, OnInit } from '@angular/core';
import { HistoricalDateModel } from '@myrmidon/cadmus-refs-historical-date';

@Component({
  selector: 'app-historical-date-pg',
  templateUrl: './historical-date-pg.component.html',
  styleUrls: ['./historical-date-pg.component.css']
})
export class HistoricalDatePgComponent implements OnInit {
  public initialDate?: HistoricalDateModel;
  public date?: HistoricalDateModel;

  constructor() { }

  ngOnInit(): void {
  }

  public onDateChange(date?: HistoricalDateModel): void {
    this.date = date;
  }
}
