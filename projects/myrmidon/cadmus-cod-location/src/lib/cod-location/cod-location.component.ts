import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  CodLocationParser,
  CodLocationRange,
  COD_LOCATION_PATTERN,
  COD_LOCATION_RANGES_PATTERN,
} from '../cod-location-parser';

@Component({
  selector: 'cadmus-cod-location',
  templateUrl: './cod-location.component.html',
  styleUrls: ['./cod-location.component.css'],
})
export class CodLocationComponent implements OnInit {
  private _initPending: boolean | undefined;
  private _changeFrozen: boolean | undefined;
  private _location: CodLocationRange[] | null;
  private _updatingVals: boolean | undefined;
  private _required: boolean | undefined;
  private _single: boolean | undefined;

  /**
   * The label to display in the control (default="location").
   */
  @Input()
  public label: string | undefined;

  /**
   * True if this location is required.
   */
  @Input()
  public get required(): boolean | undefined {
    return this._required;
  }
  public set required(value: boolean | undefined) {
    this._required = value;
    this.updateValidators();
  }
  /**
   * True if this location refers to a single sheet.
   * If false, it refers to one or more ranges.
   */
  @Input()
  public get single(): boolean | undefined {
    return this._single;
  }
  public set single(value: boolean | undefined) {
    this._single = value;
    this.updateValidators();
  }

  /**
   * The location.
   */
  @Input()
  public get location(): CodLocationRange[] | null {
    return this._location;
  }
  public set location(value: CodLocationRange[] | null) {
    this._location = value;
    if (!this.text) {
      this._initPending = true;
    } else {
      this._changeFrozen = true;
      this.text.setValue(CodLocationParser.rangesToString(value));
      this._changeFrozen = false;
    }
  }

  /**
   * Emitted when location changes.
   */
  @Output()
  public locationChange: EventEmitter<CodLocationRange[] | null>;

  public text: FormControl;
  public form: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.locationChange = new EventEmitter<CodLocationRange[] | null>();
    this._location = null;
    this.label = 'location';
    // form
    this.text = formBuilder.control(null);
    this.form = formBuilder.group({
      text: this.text,
    });
  }

  private updateValidators(): void {
    if (this._updatingVals) {
      return;
    }
    this._updatingVals = true;
    this.text.clearValidators();
    // required
    if (this.required) {
      this.text.addValidators(Validators.required);
    }
    // single
    if (this.single) {
      this.text.addValidators(Validators.pattern(COD_LOCATION_PATTERN));
    } else {
      this.text.addValidators(Validators.pattern(COD_LOCATION_RANGES_PATTERN));
    }
    this._updatingVals = false;
    this.text.updateValueAndValidity();
  }

  ngOnInit(): void {
    this.updateValidators();
    if (this._initPending) {
      this.text.setValue(CodLocationParser.rangesToString(this._location));
    }
    this.text.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((_) => {
        if (!this._changeFrozen) {
          this.emitLocationChange();
        }
      });
  }

  private emitLocationChange(): void {
    if (this._single) {
      const loc = this.text.valid
        ? CodLocationParser.parseLocation(this.text.value)
        : null;
      if (loc) {
        this.locationChange.emit([{ start: loc, end: loc }]);
      } else {
        if (!this._required && !this.text.value?.length) {
          this.locationChange.emit(null);
        }
      }
    } else {
      const ranges = this.text.valid
        ? CodLocationParser.parseLocationRanges(this.text.value)
        : null;
      if (ranges?.length) {
        this.locationChange.emit(ranges);
      } else {
        if (!this._required && !this.text.value?.length) {
          this.locationChange.emit(null);
        }
      }
    }
  }
}
