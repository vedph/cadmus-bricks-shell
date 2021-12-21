import { Component, OnInit } from '@angular/core';
import { PhysicalSize, ThesaurusEntry } from '@myrmidon/cadmus-core';

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
