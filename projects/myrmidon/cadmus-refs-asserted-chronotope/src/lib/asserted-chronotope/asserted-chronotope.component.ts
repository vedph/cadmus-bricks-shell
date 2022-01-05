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

export interface AssertedDate {
  tag?: string;
  value: HistoricalDateModel;
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
    this._chronotope = value;
    this.updateForm(value);
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

  public plTag: FormControl;
  public place: FormControl;
  public dtTag: FormControl;
  public date: FormControl;
  public hasDate: FormControl;
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
    this.hasDate = formBuilder.control(false);
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
    this.date.setValue(date);
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
      this.initialDate = value.date?.value;
      this.initialPlAssertion = value.place?.assertion;
      this.plTag.setValue(value.place?.tag);
      this.place.setValue(value.place?.value);
      this.hasDate.setValue(value.date?.value ? true : false);
      this.dtTag.setValue(value.date?.value);
      this.date.setValue(value.date?.value);
      this.form.markAsPristine();
    }
    this._updatingForm = false;
    this.emitChronotopeChange();
  }

  private getChronotope(): AssertedChronotope {
    return {
      place: {
        tag: this.plTag.value?.trim(),
        value: this.place.value?.trim(),
        assertion: this.plAssertion,
      },
      date: this.hasDate.value
        ? {
            tag: this.dtTag.value?.trim(),
            value: this.date.value,
            assertion: this.dtAssertion,
          }
        : undefined,
    };
  }

  public emitChronotopeChange(): void {
    this.chronotopeChange.emit(this.getChronotope());
  }
}
