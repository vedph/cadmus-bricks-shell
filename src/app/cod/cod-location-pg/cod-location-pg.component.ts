import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { CodLocationRange } from 'projects/myrmidon/cadmus-cod-location/src/public-api';

@Component({
  selector: 'app-cod-location-pg',
  templateUrl: './cod-location-pg.component.html',
  styleUrls: ['./cod-location-pg.component.css'],
})
export class CodLocationPgComponent implements OnInit {
  public ranges: CodLocationRange[] | null;

  public single: FormControl;
  public required: FormControl;
  public form: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.ranges = [
      {
        start: {
          s: 'x',
          n: 12,
          v: true,
          c: 'a',
          l: 3,
        },
        end: {
          s: 'x',
          n: 16,
          v: false,
          c: 'b',
          l: 11,
        },
      },
    ];
    // form
    this.single = formBuilder.control(false);
    this.required = formBuilder.control(false);
    this.form = formBuilder.group({
      single: this.single,
      required: this.required,
    });
  }

  ngOnInit(): void {}

  public onRangesChange(ranges: CodLocationRange[] | null) {
    this.ranges = ranges;
  }
}
