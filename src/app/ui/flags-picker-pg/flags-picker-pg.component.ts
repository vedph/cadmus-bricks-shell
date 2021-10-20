import { Component, OnInit } from '@angular/core';
import { Flag } from '@myrmidon/cadmus-ui-flags-picker';

@Component({
  selector: 'app-flags-picker-pg',
  templateUrl: './flags-picker-pg.component.html',
  styleUrls: ['./flags-picker-pg.component.css'],
})
export class FlagsPickerPgComponent implements OnInit {
  public ids: string[];
  public flags: Flag[];

  constructor() {
    this.ids = ['red', 'green'];
    this.flags = [
      { id: 'red', label: 'red' },
      { id: 'orange', label: 'orange' },
      { id: 'yellow', label: 'yellow' },
      { id: 'green', label: 'green' },
      { id: 'blue', label: 'blue' },
      { id: 'indigo', label: 'indigo' },
      { id: 'violet', label: 'violet' },
    ]
  }

  ngOnInit(): void {}

  public onIdsChange(ids: string[]): void {
    this.ids = ids;
  }
}
