import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'cadmus-cod-location',
  templateUrl: './cod-location.component.html',
  styleUrls: ['./cod-location.component.css'],
})
export class CodLocationComponent implements OnInit {
  /**
   * True if this location is required.
   */
  @Input()
  public required: boolean | undefined;
  /**
   * True if this location refers to a single sheet.
   * If false, it refers to one or more ranges.
   */
  @Input()
  public single: boolean | undefined;
  /**
   * True to show the sheet(s) count next to the input field.
   */
  @Input()
  public showCount: boolean | undefined;
  /**
   * The location value.
   */
  @Input()
  public value: string | undefined;
  @Output()
  public valueChange: EventEmitter<string | undefined>;

  constructor() {
    this.valueChange = new EventEmitter<string | undefined>();
  }

  ngOnInit(): void {}
}
