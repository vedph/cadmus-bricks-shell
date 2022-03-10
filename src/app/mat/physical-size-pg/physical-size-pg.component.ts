import { Component, OnInit } from '@angular/core';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { PhysicalSize } from '@myrmidon/cadmus-mat-physical-size';

@Component({
  selector: 'app-physical-size-pg',
  templateUrl: './physical-size-pg.component.html',
  styleUrls: ['./physical-size-pg.component.css'],
})
export class PhysicalSizePgComponent implements OnInit {
  public size: PhysicalSize;
  public unitEntries: ThesaurusEntry[];

  constructor() {
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
}
