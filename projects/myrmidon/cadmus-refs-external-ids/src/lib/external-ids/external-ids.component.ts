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
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

/**
 * A generic ID referred to an external resource.
 */
export interface ExternalId {
  value: string;
  scope?: string;
  tag?: string;
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
    this._ids = value || [];
    this.updateForm(value);
  }

  /**
   * True if IDs include a rank.
   */
  @Input()
  public hasRank: boolean | undefined;

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

  /**
   * Emitted whenever any ID changes.
   */
  @Output()
  public idsChange: EventEmitter<RankedExternalId[]>;

  public idsArr: FormArray;
  public form: FormGroup;

  constructor(private _formBuilder: FormBuilder) {
    this._ids = [];
    this._idsSubs = [];
    this.idsChange = new EventEmitter<RankedExternalId[]>();
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
      rank: this._formBuilder.control(id?.rank)
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
    const item = this.idsArr.controls[index];
    this.idsArr.removeAt(index);
    this.idsArr.insert(index + 1, item);

    this.swapArrElems(this._idsSubs, index, index + 1);

    this.emitIdsChange();
  }

  public clearIds(): void {
    this.idsArr.clear();
    this.unsubscribeIds();
    this._idsSubs = [];
    if (!this._updatingForm) {
      this.emitIdsChange();
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
        rank: g.controls.rank.value? g.controls.rank.value : undefined
      });
    }
    return ids;
  }

  private emitIdsChange(): void {
    this.idsChange.emit(this.getIds());
  }
}
