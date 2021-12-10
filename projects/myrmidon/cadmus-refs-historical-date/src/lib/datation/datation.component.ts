import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';

import { Datation, DatationModel } from '@myrmidon/cadmus-core';
import { debounceTime } from 'rxjs/operators';

/**
 * Editor for a single point in a historical date.
 */
@Component({
  selector: 'cadmus-refs-datation',
  templateUrl: './datation.component.html',
  styleUrls: ['./datation.component.css'],
})
export class DatationComponent implements OnInit {
  private _changeFrozen?: boolean;
  private _datation: DatationModel | undefined;

  @Input()
  public get datation(): DatationModel | undefined {
    return this._datation;
  }
  public set datation(value: DatationModel | undefined) {
    this._datation = value;
    this.updateForm(value);
  }

  @Output()
  public datationChange: EventEmitter<DatationModel | undefined>;

  public value: FormControl;
  public century: FormControl;
  public span: FormControl;
  public month: FormControl;
  public day: FormControl;
  public about: FormControl;
  public dubious: FormControl;
  public hint: FormControl;
  public form: FormGroup;

  /**
   * The optional label to display for this datation.
   */
  @Input() public label?: string;

  constructor(formBuilder: FormBuilder) {
    this.datationChange = new EventEmitter<DatationModel | undefined>();
    // form
    this.value = formBuilder.control(0);
    this.century = formBuilder.control(false);
    this.span = formBuilder.control(false);
    this.month = formBuilder.control(0, [
      Validators.min(0),
      Validators.max(12),
    ]);
    this.day = formBuilder.control(0, [Validators.min(0), Validators.max(31)]);
    this.about = formBuilder.control(false);
    this.dubious = formBuilder.control(false);
    this.hint = formBuilder.control(null, Validators.maxLength(500));
    this.form = formBuilder.group({
      value: this.value,
      century: this.century,
      span: this.span,
      month: this.month,
      day: this.day,
      about: this.about,
      dubious: this.dubious,
      hint: this.hint,
    });
  }

  public ngOnInit(): void {
    this.form.valueChanges.pipe(debounceTime(300)).subscribe((_) => {
      if (!this._changeFrozen) {
        this.emitChange();
      }
    });
  }

  private updateForm(model: DatationModel | undefined): void {
    this._changeFrozen = true;
    if (!model) {
      this.form.reset();
    } else {
      this.value.setValue(model.value);
      this.century.setValue(model.isCentury);
      this.span.setValue(model.isSpan);
      this.month.setValue(model.month);
      this.day.setValue(model.day);
      this.about.setValue(model.isApproximate);
      this.dubious.setValue(model.isDubious);
      this.hint.setValue(model.hint);
      this.form.markAsPristine();
    }
    this._changeFrozen = false;
  }

  private getDatation(): DatationModel {
    return {
      value: this.value.value ? +this.value.value : 0,
      isCentury: this.century.value || false,
      isSpan: this.span.value || false,
      month: this.month.value ? +this.month.value : 0,
      day: this.day.value ? +this.day.value : 0,
      isApproximate: this.about.value || false,
      isDubious: this.dubious.value || false,
      hint: Datation.sanitizeHint(this.hint.value),
    };
  }

  private emitChange(): void {
    this.datationChange.emit(this.getDatation());
  }
}
