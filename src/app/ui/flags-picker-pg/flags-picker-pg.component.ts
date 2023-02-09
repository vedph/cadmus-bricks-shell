import { Component, OnInit } from '@angular/core';
import { Flag } from '@myrmidon/cadmus-ui-flags-picker';

@Component({
  selector: 'app-flags-picker-pg',
  templateUrl: './flags-picker-pg.component.html',
  styleUrls: ['./flags-picker-pg.component.css'],
})
export class FlagsPickerPgComponent implements OnInit {
  public flags: Flag[];

  constructor() {
    this.flags = [
      { id: 'red', label: 'red', checked: true },
      { id: 'orange', label: 'orange' },
      { id: 'yellow', label: 'yellow' },
      { id: 'green', label: 'green', checked: true },
      { id: 'blue', label: 'blue' },
      { id: 'indigo', label: 'indigo' },
      { id: 'violet', label: 'violet' },
    ];
  }

  ngOnInit(): void {}

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
    const flags = [...this.flags];
    const checkedIndex = this.getRandomInt(0, this.flags.length);
    for (let i = 0; i < flags.length; i++) {
      flags[i].checked = (i === checkedIndex);
    }
    this.flags = flags;
  }
}
