import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { PhysicalSize } from '@myrmidon/cadmus-mat-physical-size';

@Component({
  selector: 'app-physical-size-pg',
  templateUrl: './physical-size-pg.component.html',
  styleUrls: ['./physical-size-pg.component.css'],
})
export class PhysicalSizePgComponent implements OnInit {
  public size?: PhysicalSize;
  public defaultUnit?: string;
  public unitEntries: ThesaurusEntry[];
  public hBeforeW: FormControl<boolean>;

  constructor(formBuilder: FormBuilder) {
    this.hBeforeW = formBuilder.control(false, { nonNullable: true });
    this.size = {
      w: {
        value: 21,
        unit: 'cm',
      },
      h: {
        value: 29.7,
        unit: 'cm',
      },
    };
    this.unitEntries = [
      {
        id: 'mm',
        value: 'mm',
      },
      {
        id: 'cm',
        value: 'cm',
      },
      {
        id: 'mt',
        value: 'mt',
      },
    ];
  }

  ngOnInit(): void {}

  public onSizeChange(size: PhysicalSize): void {
    this.size = size;
  }

  public reset(): void {
    this.defaultUnit = this.defaultUnit? undefined : 'mm';
    this.size = undefined;
  }
}
