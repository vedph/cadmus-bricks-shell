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
    ];
  }

  ngOnInit(): void {}

  public onIdsChange(ids: string[]): void {
    this.ids = ids;
  }

  public onFlagsChange(flags: Flag[]): void {
    this.flags = flags;
  }

  private getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    // maximum is exclusive and the minimum is inclusive
    return Math.floor(Math.random() * (max - min) + min);
  }

  public setRandomId(): void {
    this.ids = [this.flags[this.getRandomInt(0, this.flags.length)].id];
  }
}
