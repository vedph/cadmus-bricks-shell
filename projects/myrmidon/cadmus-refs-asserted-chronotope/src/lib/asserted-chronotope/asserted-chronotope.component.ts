import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { Assertion } from '@myrmidon/cadmus-refs-assertion';
import { HistoricalDateModel } from '@myrmidon/cadmus-refs-historical-date';

export interface AssertedPlace {
  tag?: string;
  value: string;
  assertion?: Assertion;
}

export interface AssertedDate extends HistoricalDateModel {
  tag?: string;
  assertion?: Assertion;
}

export interface AssertedChronotope {
  place?: AssertedPlace;
  date?: AssertedDate;
}

@Component({
  selector: 'cadmus-refs-asserted-chronotope',
  templateUrl: './asserted-chronotope.component.html',
  styleUrls: ['./asserted-chronotope.component.css'],
})
export class AssertedChronotopeComponent implements OnInit {
  private _updatingForm: boolean | undefined;
  private _chronotope: AssertedChronotope | undefined;

  @Input()
  public get chronotope(): AssertedChronotope | undefined {
    return this._chronotope;
  }
  public set chronotope(value: AssertedChronotope | undefined) {
    if (this._chronotope !== value) {
      this._chronotope = value;
      this.updateForm(value);
    }
  }

  @Input()
  public tagEntries: ThesaurusEntry[] | undefined;

  @Input()
  public assTagEntries?: ThesaurusEntry[];

  @Input()
  public refTypeEntries: ThesaurusEntry[] | undefined;

  @Input()
  public refTagEntries: ThesaurusEntry[] | undefined;

  @Output()
  public chronotopeChange: EventEmitter<AssertedChronotope>;

  public plTag: FormControl<string | null>;
  public place: FormControl<string | null>;
  public dtTag: FormControl<string | null>;
  public date: FormControl<HistoricalDateModel | null>;
  public hasDate: FormControl<boolean>;
  public form: FormGroup;

  public initialDate?: HistoricalDateModel;
  public initialDtAssertion?: Assertion;
  public dtAssertion?: Assertion;

  public initialPlAssertion?: Assertion;
  public plAssertion?: Assertion;

  constructor(formBuilder: FormBuilder) {
    this.chronotopeChange = new EventEmitter<AssertedChronotope>();
    // form
    this.plTag = formBuilder.control(null, Validators.maxLength(50));
    this.place = formBuilder.control(null, Validators.maxLength(50));
    this.dtTag = formBuilder.control(null, Validators.maxLength(50));
    this.hasDate = formBuilder.control(false, { nonNullable: true });
    this.date = formBuilder.control(null);
    this.form = formBuilder.group({
      plTag: this.plTag,
      place: this.place,
      hasDate: this.hasDate,
      dtTag: this.dtTag,
      date: this.date,
    });
  }

  ngOnInit(): void {
    this.form.valueChanges.pipe(debounceTime(350)).subscribe((_) => {
      if (!this._updatingForm) {
        this.emitChronotopeChange();
      }
    });
  }

  public onPlAssertionChange(assertion: Assertion | undefined): void {
    this.plAssertion = assertion;
    setTimeout(() => this.emitChronotopeChange(), 0);
  }

  public onDtAssertionChange(assertion: Assertion | undefined): void {
    this.dtAssertion = assertion;
    setTimeout(() => this.emitChronotopeChange(), 0);
  }

  public onDateChange(date?: HistoricalDateModel): void {
    this.date.setValue(date || null);
    setTimeout(() => this.emitChronotopeChange(), 0);
  }

  private updateForm(value: AssertedChronotope | undefined): void {
    this._updatingForm = true;
    if (!value) {
      this.initialDate = undefined;
      this.initialPlAssertion = undefined;
      this.initialDtAssertion = undefined;
      this.form.reset();
    } else {
      this.initialDate = value.date;
      this.initialPlAssertion = value.place?.assertion;
      this.initialDtAssertion = value.date?.assertion;
      this.plTag.setValue(value.place?.tag || null);
      this.place.setValue(value.place?.value || null);
      this.hasDate.setValue(value.date ? true : false);
      this.dtTag.setValue(value.date?.tag || null);
      this.date.setValue(value.date as HistoricalDateModel);
      this.form.markAsPristine();
    }
    this._updatingForm = false;
  }

  private getChronotope(): AssertedChronotope {
    return {
      place: this.place.value
        ? {
            tag: this.plTag.value?.trim(),
            value: this.place.value?.trim(),
            assertion: this.plAssertion,
          }
        : undefined,
      date:
        this.hasDate.value && this.date.value
          ? {
              ...this.date.value,
              tag: this.dtTag.value?.trim(),
              assertion: this.dtAssertion,
            }
          : undefined,
    };
  }

  public emitChronotopeChange(): void {
    this.chronotopeChange.emit(this.getChronotope());
  }
}
