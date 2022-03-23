import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

/**
 * A count decorated with the ID of the entity being counted,
 * and optionally by a tag and/or note.
 */
export interface DecoratedCount {
  id: string;
  value: number;
  tag?: string;
  note?: string;
}

@Component({
  selector: 'cadmus-refs-decorated-counts',
  templateUrl: './decorated-counts.component.html',
  styleUrls: ['./decorated-counts.component.css'],
})
export class DecoratedCountsComponent implements OnInit, OnDestroy {
  private _counts: DecoratedCount[] | undefined;
  private _subs: Subscription[];

  @Input()
  public get counts(): DecoratedCount[] | undefined {
    return this._counts;
  }
  public set counts(value: DecoratedCount[] | undefined) {
    this._counts = value;
    this.updateForm(value);
  }

  // decorated-count-tags
  @Input()
  public tagEntries: ThesaurusEntry[] | undefined;

  @Output()
  public countsChange: EventEmitter<DecoratedCount[]>;

  public entries: FormArray;
  public form: FormGroup;

  constructor(private _formBuilder: FormBuilder) {
    this.countsChange = new EventEmitter<DecoratedCount[]>();
    this._subs = [];
    // form
    this.entries = _formBuilder.array([]);
    this.form = _formBuilder.group({
      entries: this.entries,
    });
  }

  ngOnInit(): void {
    if (this._counts) {
      this.updateForm(this._counts);
    }
  }

  ngOnDestroy(): void {
    this._subs.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  private updateForm(counts: DecoratedCount[] | undefined): void {
    if (!counts) {
      this.form.reset();
      return;
    }

    this.entries.clear();
    if (counts?.length) {
      for (let e of counts) {
        const g = this.getCountGroup(e);
        this.entries.controls.push(g);
        this._subs.push(
          g.valueChanges.pipe(debounceTime(300)).subscribe((_) => {
            this.emitCountsChange();
          })
        );
      }
    }
    this.form.markAsPristine();
  }

  private swapArrElems(a: any[], i: number, j: number): void {
    if (i === j) {
      return;
    }
    const t = a[i];
    a[i] = a[j];
    a[j] = t;
  }

  private getCountGroup(item?: DecoratedCount): FormGroup {
    return this._formBuilder.group({
      id: this._formBuilder.control(item?.id, [
        Validators.required,
        Validators.maxLength(50),
      ]),
      value: this._formBuilder.control(item?.value || 0, Validators.required),
      tag: this._formBuilder.control(item?.tag, Validators.maxLength(50)),
      note: this._formBuilder.control(item?.note, Validators.maxLength(200)),
    });
  }

  public addCount(item?: DecoratedCount): void {
    const g = this.getCountGroup(item);
    this._subs.push(
      g.valueChanges.pipe(debounceTime(300)).subscribe((_) => {
        this.emitCountsChange();
      })
    );
    this.entries.push(g);
    this.entries.updateValueAndValidity();
    this.entries.markAsDirty();
    this.emitCountsChange();
  }

  public removeCount(index: number): void {
    this._subs[index].unsubscribe();
    this._subs.splice(index, 1);
    this.entries.removeAt(index);
    this.entries.updateValueAndValidity();
    this.entries.markAsDirty();
    this.emitCountsChange();
  }

  public moveCountUp(index: number): void {
    if (index < 1) {
      return;
    }
    this.swapArrElems(this._subs, index, index - 1);

    const item = this.entries.controls[index];
    this.entries.removeAt(index);
    this.entries.insert(index - 1, item);
    this.entries.markAsDirty();
    this.entries.updateValueAndValidity();
    this.emitCountsChange();
  }

  public moveCountDown(index: number): void {
    if (index + 1 >= this.entries.length) {
      return;
    }
    this.swapArrElems(this._subs, index, index + 1);

    const item = this.entries.controls[index];
    this.entries.removeAt(index);
    this.entries.insert(index + 1, item);
    this.entries.markAsDirty();
    this.entries.updateValueAndValidity();
    this.emitCountsChange();
  }

  private getCounts(): DecoratedCount[] | undefined {
    const counts: DecoratedCount[] = [];
    for (let i = 0; i < this.entries.length; i++) {
      const g = this.entries.at(i) as FormGroup;
      counts.push({
        id: g.controls['id'].value,
        value: g.controls['value'].value || 0,
        tag: g.controls['tag'].value?.trim(),
        note: g.controls['note'].value?.trim(),
      });
    }
    return counts.length ? counts : undefined;
  }

  public emitCountsChange(): void {
    if (this.form.invalid) {
      return;
    }
    this.countsChange.emit(this.getCounts());
  }
}
