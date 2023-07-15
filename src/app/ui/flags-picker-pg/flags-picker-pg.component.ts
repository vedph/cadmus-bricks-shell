import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

import {
  Flag,
  FlagsPickerAdapter,
} from 'projects/myrmidon/cadmus-ui-flags-picker/src/public-api';

@Component({
  selector: 'app-flags-picker-pg',
  templateUrl: './flags-picker-pg.component.html',
  styleUrls: ['./flags-picker-pg.component.css'],
})
export class FlagsPickerPgComponent implements OnInit {
  private readonly _adapter: FlagsPickerAdapter;

  public usrFlags: FormControl<string | null>;
  public usrIds: FormControl<string | null>;
  public applyChecks: FormControl<boolean>;
  public supplyFlags: FormControl<boolean>;
  public form: FormGroup;
  public flags$: Observable<Flag[]>;
  public result?: Flag[];

  constructor(formBuilder: FormBuilder) {
    const initialFlags = [
      { id: 'red', label: 'red', checked: true },
      { id: 'orange', label: 'orange' },
      { id: 'yellow', label: 'yellow' },
      { id: 'green', label: 'green', checked: true },
      { id: 'blue', label: 'blue' },
      { id: 'indigo', label: 'indigo' },
      { id: 'violet', label: 'violet' },
    ];

    // use an adapter with a single slot 'a'
    this._adapter = new FlagsPickerAdapter();
    this.flags$ = this._adapter.selectFlags('a');

    // form
    this.usrFlags = formBuilder.control(JSON.stringify(initialFlags), {
      nonNullable: true,
    });
    this.usrIds = formBuilder.control('red,green', { nonNullable: true });
    this.applyChecks = formBuilder.control(false, { nonNullable: true });
    this.supplyFlags = formBuilder.control(false, { nonNullable: true });
    this.form = formBuilder.group({
      usrFlags: this.usrFlags,
      usrIds: this.usrIds,
      applyChecks: this.applyChecks,
      supplyFlags: this.supplyFlags,
    });
  }

  ngOnInit(): void {
    this.setFlags();
  }

  public onFlagsChange(flags: Flag[]): void {
    this._adapter.setSlotFlags('a', flags, true);
    this.result = flags;
  }

  public setFlags(): void {
    this._adapter.setSlotFlags(
      'a',
      JSON.parse(this.usrFlags.value || '[]'),
      this.applyChecks.value
    );
  }

  public setChecks(): void {
    this._adapter.setSlotChecks(
      'a',
      (this.usrIds.value || '').split(',').filter((s) => s.trim().length),
      this.supplyFlags.value
    );
  }

  // private getRandomInt(min: number, max: number) {
  //   min = Math.ceil(min);
  //   max = Math.floor(max);
  //   // maximum is exclusive and the minimum is inclusive
  //   return Math.floor(Math.random() * (max - min) + min);
  // }
}
