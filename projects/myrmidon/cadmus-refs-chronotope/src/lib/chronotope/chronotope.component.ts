import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HistoricalDateModel, ThesaurusEntry } from '@myrmidon/cadmus-core';
import { Assertion } from '@myrmidon/cadmus-refs-assertion';
import { debounceTime } from 'rxjs/operators';

/**
 * Chronotopic coordinates: a place with a date.
 */
export interface Chronotope {
  tag?: string;
  place?: string;
  date?: HistoricalDateModel;
  note?: string;
}

/**
 * A chronotope with an assertion.
 */
export interface AssertedChronotope extends Chronotope {
  assertion?: Assertion;
}

@Component({
  selector: 'cadmus-refs-chronotope',
  templateUrl: './chronotope.component.html',
  styleUrls: ['./chronotope.component.css'],
})
export class ChronotopeComponent implements OnInit {
  private _updatingForm: boolean | undefined;
  private _chronotope: AssertedChronotope | undefined;

  @Input()
  public asserted: boolean | undefined;

  @Input()
  public get chronotope(): AssertedChronotope | undefined {
    return this._chronotope;
  }
  public set chronotope(value: AssertedChronotope | undefined) {
    this._chronotope = value;
    this.updateForm(value);
  }

  @Input()
  public ctTagEntries: ThesaurusEntry[] | undefined;

  @Input()
  public assTagEntries?: ThesaurusEntry[];

  @Input()
  public refTypeEntries: ThesaurusEntry[] | undefined;

  @Input()
  public refTagEntries: ThesaurusEntry[] | undefined;

  @Output()
  public chronotopeChange: EventEmitter<AssertedChronotope>;

  public tag: FormControl;
  public place: FormControl;
  public hasDate: FormControl;
  public note: FormControl;
  public form: FormGroup;

  public initialDate?: HistoricalDateModel;
  public date?: HistoricalDateModel;

  public initialAssertion?: Assertion;
  public assertion?: Assertion;

  constructor(formBuilder: FormBuilder) {
    this.chronotopeChange = new EventEmitter<AssertedChronotope>();
    // form
    this.tag = formBuilder.control(null, Validators.maxLength(50));
    this.place = formBuilder.control(null, Validators.maxLength(50));
    this.hasDate = formBuilder.control(false);
    this.note = formBuilder.control(null, Validators.maxLength(1000));
    this.form = formBuilder.group({
      tag: this.tag,
      place: this.place,
      hasDate: this.hasDate,
      note: this.note,
    });
  }

  ngOnInit(): void {
    this.form.valueChanges.pipe(debounceTime(350)).subscribe((_) => {
      if (!this._updatingForm) {
        this.emitChronotopeChange();
      }
    });
  }

  public onAssertionChange(assertion: Assertion | undefined): void {
    this.assertion = assertion;
    setTimeout(() => this.emitChronotopeChange(), 0);
  }

  public onDateChange(date?: HistoricalDateModel): void {
    this.date = date;
    setTimeout(() => this.emitChronotopeChange(), 0);
  }

  private updateForm(value: AssertedChronotope | undefined): void {
    this._updatingForm = true;
    if (!value) {
      this.initialDate = undefined;
      this.initialAssertion = undefined;
      this.form.reset();
      return;
    } else {
      this.initialDate = value.date;
      this.initialAssertion = value.assertion;
      this.tag.setValue(value.tag);
      this.place.setValue(value.place);
      this.hasDate.setValue(value.date ? true : false);
      this.note.setValue(value.note);
      this.form.markAsPristine();
    }
    this._updatingForm = false;
    this.emitChronotopeChange();
  }

  private getChronotope(): AssertedChronotope {
    return {
      tag: this.tag.value?.trim(),
      place: this.place.value?.trim(),
      date: this.hasDate.value ? this.date : undefined,
      note: this.note.value?.trim(),
      assertion: this.asserted && this.assertion ? this.assertion : undefined,
    };
  }

  public emitChronotopeChange(): void {
    this.chronotopeChange.emit(this.getChronotope());
  }
}
