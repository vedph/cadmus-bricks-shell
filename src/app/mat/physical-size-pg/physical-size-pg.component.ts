import { Component, OnInit } from '@angular/core';
import { PhysicalSize } from '@myrmidon/cadmus-core';

@Component({
  selector: 'app-physical-size-pg',
  templateUrl: './physical-size-pg.component.html',
  styleUrls: ['./physical-size-pg.component.css'],
})
export class PhysicalSizePgComponent implements OnInit {
  public size: PhysicalSize;

  constructor() {
    this.size = {
      w: {
        value: 21,
        unit: 'cm',
      },
      h: {
        value: 29.7,
        unit: 'cm',
      }
    };
  }

  ngOnInit(): void {}
}
