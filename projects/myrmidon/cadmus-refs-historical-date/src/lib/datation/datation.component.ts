import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';

import { debounceTime } from 'rxjs/operators';
import { Datation, DatationModel } from './datation';

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

  public value: FormControl<number>;
  public century: FormControl<boolean>;
  public span: FormControl<boolean>;
  public month: FormControl<number>;
  public day: FormControl<number>;
  public about: FormControl<boolean>;
  public dubious: FormControl<boolean>;
  public hint: FormControl<string | null>;
  public form: FormGroup;

  /**
   * The optional label to display for this datation.
   */
  @Input() public label?: string;

  constructor(formBuilder: FormBuilder) {
    this.datationChange = new EventEmitter<DatationModel | undefined>();
    // form
    this.value = formBuilder.control(0, { nonNullable: true });
    this.century = formBuilder.control(false, { nonNullable: true });
    this.span = formBuilder.control(false, { nonNullable: true });
    this.month = formBuilder.control(0, {
      validators: [Validators.min(0), Validators.max(12)],
      nonNullable: true,
    });
    this.day = formBuilder.control(0, {
      validators: [Validators.min(0), Validators.max(31)],
      nonNullable: true,
    });
    this.about = formBuilder.control(false, { nonNullable: true });
    this.dubious = formBuilder.control(false, { nonNullable: true });
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
      this.century.setValue(model.isCentury || false);
      this.span.setValue(model.isSpan || false);
      this.month.setValue(model.month || 0);
      this.day.setValue(model.day || 0);
      this.about.setValue(model.isApproximate || false);
      this.dubious.setValue(model.isDubious || false);
      this.hint.setValue(model.hint || null);
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
