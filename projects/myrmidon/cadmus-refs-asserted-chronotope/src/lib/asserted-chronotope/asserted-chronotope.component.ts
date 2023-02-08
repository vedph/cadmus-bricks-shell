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
  public get chronotope(): AssertedChronotope | undefined | null {
    return this._chronotope;
  }
  public set chronotope(value: AssertedChronotope | undefined | null) {
    if (this._chronotope !== value) {
      this._chronotope = value || undefined;
      this.updateForm(this._chronotope);
    }
  }

  // chronotope-tags
  @Input()
  public tagEntries: ThesaurusEntry[] | undefined;

  // assertion-tags
  @Input()
  public assTagEntries?: ThesaurusEntry[];

  // doc-reference-types
  @Input()
  public refTypeEntries: ThesaurusEntry[] | undefined;

  // doc-reference-tags
  @Input()
  public refTagEntries: ThesaurusEntry[] | undefined;

  @Output()
  public chronotopeChange: EventEmitter<AssertedChronotope>;

  public plTag: FormControl<string | null>;
  public plAssertion: FormControl<Assertion | null>;
  public place: FormControl<string | null>;
  public dtTag: FormControl<string | null>;
  public dtAssertion: FormControl<Assertion | null>;
  public date: FormControl<HistoricalDateModel | null>;
  public hasDate: FormControl<boolean>;
  public form: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.chronotopeChange = new EventEmitter<AssertedChronotope>();
    // form
    this.plTag = formBuilder.control(null, Validators.maxLength(50));
    this.plAssertion = formBuilder.control(null);
    this.place = formBuilder.control(null, Validators.maxLength(50));
    this.dtTag = formBuilder.control(null, Validators.maxLength(50));
    this.dtAssertion = formBuilder.control(null);
    this.hasDate = formBuilder.control(false, { nonNullable: true });
    this.date = formBuilder.control(null);
    this.form = formBuilder.group({
      plTag: this.plTag,
      plAssertion: this.plAssertion,
      place: this.place,
      hasDate: this.hasDate,
      dtTag: this.dtTag,
      dtAssertion: this.dtAssertion,
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
    this.plAssertion.setValue(assertion || null);
    this.plAssertion.updateValueAndValidity();
    this.plAssertion.markAsDirty();
  }

  public onDtAssertionChange(assertion: Assertion | undefined): void {
    this.dtAssertion.setValue(assertion || null);
    this.dtAssertion.updateValueAndValidity();
    this.dtAssertion.markAsDirty();
  }

  public onDateChange(date?: HistoricalDateModel): void {
    this.date.setValue(date || null);
    this.date.updateValueAndValidity();
    this.date.markAsDirty();
  }

  private updateForm(value: AssertedChronotope | undefined): void {
    this._updatingForm = true;
    if (!value) {
      this.form.reset();
    } else {
      this.plTag.setValue(value.place?.tag || null);
      this.plAssertion.setValue(value.place?.assertion || null);
      this.place.setValue(value.place?.value || null);
      this.hasDate.setValue(value.date ? true : false);
      this.dtTag.setValue(value.date?.tag || null);
      this.dtAssertion.setValue(value.date?.assertion || null);
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
            assertion: this.plAssertion.value || undefined,
          }
        : undefined,
      date:
        this.hasDate.value && this.date.value
          ? {
              ...this.date.value,
              tag: this.dtTag.value?.trim(),
              assertion: this.dtAssertion.value || undefined,
            }
          : undefined,
    };
  }

  public emitChronotopeChange(): void {
    this._chronotope = this.getChronotope();
    this.chronotopeChange.emit(this._chronotope);
  }
}
