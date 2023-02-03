import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { Assertion } from '@myrmidon/cadmus-refs-assertion';

import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

/**
 * A generic ID referred to an external resource.
 */
export interface ExternalId {
  value: string;
  scope?: string;
  tag?: string;
  assertion?: Assertion;
}

/**
 * An external ID plus a rank.
 */
export interface RankedExternalId extends ExternalId {
  rank?: number;
}

@Component({
  selector: 'cadmus-refs-external-ids',
  templateUrl: './external-ids.component.html',
  styleUrls: ['./external-ids.component.css'],
})
export class ExternalIdsComponent implements OnDestroy {
  private _ids: ExternalId[];
  private _idSubscription: Subscription | undefined;
  private _idsSubs: Subscription[];
  private _updatingForm: boolean | undefined;

  @ViewChildren('id') idQueryList: QueryList<any> | undefined;

  /**
   * The external IDs.
   */
  @Input()
  public get ids(): RankedExternalId[] {
    return this._ids;
  }
  public set ids(value: RankedExternalId[]) {
    if (this._ids !== value) {
      this._ids = value || [];
      this.updateForm(value);
    }
  }

  /**
   * The ID scopes thesaurus entries.
   */
  @Input()
  public scopeEntries: ThesaurusEntry[] | undefined;

  /**
   * The ID tags thesaurus entries.
   */
  @Input()
  public tagEntries: ThesaurusEntry[] | undefined;

  // thesauri for assertions
  @Input()
  public assTagEntries?: ThesaurusEntry[];

  @Input()
  public refTypeEntries: ThesaurusEntry[] | undefined;

  @Input()
  public refTagEntries: ThesaurusEntry[] | undefined;

  /**
   * Emitted whenever any ID changes.
   */
  @Output()
  public idsChange: EventEmitter<RankedExternalId[]>;

  public idsArr: FormArray;
  public form: FormGroup;
  // edited assertion
  public assEdOpen: boolean;
  public assertionNr?: number;
  public initialAssertion?: Assertion;
  public assertion?: Assertion;

  constructor(private _formBuilder: FormBuilder) {
    this._ids = [];
    this._idsSubs = [];
    this.idsChange = new EventEmitter<RankedExternalId[]>();
    this.assEdOpen = false;
    // form
    this.idsArr = _formBuilder.array([]);
    this.form = _formBuilder.group({
      idsArr: this.idsArr,
    });
  }

  public ngAfterViewInit(): void {
    // focus on newly added ID
    this._idSubscription = this.idQueryList?.changes
      .pipe(debounceTime(300))
      .subscribe((lst: QueryList<any>) => {
        if (!this._updatingForm && lst.length > 0) {
          lst.last.nativeElement.focus();
        }
      });
  }

  private unsubscribeIds(): void {
    for (let i = 0; i < this._idsSubs.length; i++) {
      this._idsSubs[i].unsubscribe();
    }
  }

  public ngOnDestroy(): void {
    this.unsubscribeIds();
    this._idSubscription?.unsubscribe();
  }

  private getIdGroup(id?: RankedExternalId): FormGroup {
    return this._formBuilder.group({
      value: this._formBuilder.control(id?.value, [
        Validators.required,
        Validators.maxLength(500),
      ]),
      scope: this._formBuilder.control(id?.scope, Validators.maxLength(50)),
      tag: this._formBuilder.control(id?.tag, Validators.maxLength(50)),
      rank: this._formBuilder.control(id?.rank),
      assertion: this._formBuilder.control(id?.assertion),
    });
  }

  public addId(id?: RankedExternalId): void {
    const g = this.getIdGroup(id);
    this._idsSubs.push(
      g.valueChanges.pipe(debounceTime(300)).subscribe((_) => {
        this.emitIdsChange();
      })
    );
    this.idsArr.push(g);
    if (!this._updatingForm) {
      this.emitIdsChange();
    }
  }

  public removeId(index: number): void {
    this.closeAssertion();
    this._idsSubs[index].unsubscribe();
    this._idsSubs.splice(index, 1);
    this.idsArr.removeAt(index);
    this.emitIdsChange();
  }

  private swapArrElems(a: any[], i: number, j: number): void {
    if (i === j) {
      return;
    }
    const t = a[i];
    a[i] = a[j];
    a[j] = t;
  }

  public moveIdUp(index: number): void {
    if (index < 1) {
      return;
    }
    this.closeAssertion();
    const ctl = this.idsArr.controls[index];
    this.idsArr.removeAt(index);
    this.idsArr.insert(index - 1, ctl);

    this.swapArrElems(this._idsSubs, index, index - 1);

    this.emitIdsChange();
  }

  public moveIdDown(index: number): void {
    if (index + 1 >= this.idsArr.length) {
      return;
    }
    this.closeAssertion();
    const item = this.idsArr.controls[index];
    this.idsArr.removeAt(index);
    this.idsArr.insert(index + 1, item);

    this.swapArrElems(this._idsSubs, index, index + 1);

    this.emitIdsChange();
  }

  public clearIds(): void {
    this.closeAssertion();
    this.idsArr.clear();
    this.unsubscribeIds();
    this._idsSubs = [];
    if (!this._updatingForm) {
      this.emitIdsChange();
    }
  }

  public editAssertion(index: number): void {
    // save the currently edited assertion if any
    this.saveAssertion();
    // edit the new assertion
    this.initialAssertion = (this.idsArr.at(index) as FormGroup).controls[
      'assertion'
    ].value;
    this.assertionNr = index + 1;
    this.assEdOpen = true;
  }

  public onAssertionChange(assertion: Assertion | undefined): void {
    this.assertion = assertion;
  }

  public saveAssertion(): void {
    // save the currently edited assertion if any
    if (this.assertionNr) {
      const g = this.idsArr.at(this.assertionNr - 1) as FormGroup;
      g.controls['assertion'].setValue(this.assertion);
      this.closeAssertion();
      this.emitIdsChange();
    }
  }

  private closeAssertion(): void {
    if (this.assertionNr) {
      this.assEdOpen = false;
      this.assertionNr = 0;
      this.initialAssertion = undefined;
    }
  }

  private updateForm(ids: RankedExternalId[]): void {
    if (!this.idsArr) {
      return;
    }
    this._updatingForm = true;
    this.clearIds();

    if (!ids) {
      this.form.reset();
    } else {
      for (const id of ids) {
        this.addId(id);
      }
      this.form.markAsPristine();
    }
    this._updatingForm = false;
    this.emitIdsChange();
  }

  private getIds(): RankedExternalId[] {
    const ids: RankedExternalId[] = [];
    for (let i = 0; i < this.idsArr.length; i++) {
      const g = this.idsArr.controls[i] as FormGroup;
      ids.push({
        value: g.controls.value.value?.trim(),
        scope: g.controls.scope.value?.trim(),
        tag: g.controls.tag.value?.trim(),
        assertion: g.controls.assertion.value,
      });
    }
    return ids;
  }

  private emitIdsChange(): void {
    this._ids = this.getIds();
    this.idsChange.emit(this._ids);
  }
}
