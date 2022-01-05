import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { HistoricalDateModel } from '@myrmidon/cadmus-refs-historical-date';
import { debounceTime } from 'rxjs/operators';

/**
 * Chronotopic coordinates: a place with a date.
 */
export interface Chronotope {
  tag?: string;
  place?: string;
  date?: HistoricalDateModel;
}

@Component({
  selector: 'cadmus-refs-chronotope',
  templateUrl: './chronotope.component.html',
  styleUrls: ['./chronotope.component.css'],
})
export class ChronotopeComponent implements OnInit {
  private _updatingForm: boolean | undefined;
  private _chronotope: Chronotope | undefined;

  @Input()
  public get chronotope(): Chronotope | undefined {
    return this._chronotope;
  }
  public set chronotope(value: Chronotope | undefined) {
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
  public chronotopeChange: EventEmitter<Chronotope>;

  public tag: FormControl;
  public place: FormControl;
  public hasDate: FormControl;
  public form: FormGroup;

  public initialDate?: HistoricalDateModel;
  public date?: HistoricalDateModel;

  constructor(formBuilder: FormBuilder) {
    this.chronotopeChange = new EventEmitter<Chronotope>();
    // form
    this.tag = formBuilder.control(null, Validators.maxLength(50));
    this.place = formBuilder.control(null, Validators.maxLength(50));
    this.hasDate = formBuilder.control(false);
    this.form = formBuilder.group({
      tag: this.tag,
      place: this.place,
      hasDate: this.hasDate,
    });
  }

  ngOnInit(): void {
    this.form.valueChanges.pipe(debounceTime(350)).subscribe((_) => {
      if (!this._updatingForm) {
        this.emitChronotopeChange();
      }
    });
  }

  public onDateChange(date?: HistoricalDateModel): void {
    this.date = date;
    setTimeout(() => this.emitChronotopeChange(), 0);
  }

  private updateForm(value: Chronotope | undefined): void {
    this._updatingForm = true;
    if (!value) {
      this.initialDate = undefined;
      this.form.reset();
    } else {
      this.initialDate = value.date;
      this.tag.setValue(value.tag);
      this.place.setValue(value.place);
      this.hasDate.setValue(value.date ? true : false);
      this.form.markAsPristine();
    }
    this._updatingForm = false;
    this.emitChronotopeChange();
  }

  private getChronotope(): Chronotope {
    return {
      tag: this.tag.value?.trim(),
      place: this.place.value?.trim(),
      date: this.hasDate.value ? this.date : undefined,
    };
  }

  public emitChronotopeChange(): void {
    this.chronotopeChange.emit(this.getChronotope());
  }
}
