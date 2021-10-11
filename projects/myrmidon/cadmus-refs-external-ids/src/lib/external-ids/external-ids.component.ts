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
  type?: string;
  tag?: string;
  note?: string;
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
  public get ids(): ExternalId[] {
    return this._ids;
  }
  public set ids(value: ExternalId[]) {
    this._ids = value || [];
    this.updateForm(value);
  }

  /**
   * The ID types thesaurus entries.
   */
  @Input()
  public typeEntries: ThesaurusEntry[] | undefined;

  /**
   * The ID tags thesaurus entries.
   */
  @Input()
  public tagEntries: ThesaurusEntry[] | undefined;

  /**
   * Emitted whenever any ID changes.
   */
  @Output()
  public idsChange: EventEmitter<ExternalId[]>;

  public idsArr: FormArray;
  public form: FormGroup;

  constructor(private _formBuilder: FormBuilder) {
    this._ids = [];
    this._idsSubs = [];
    this.idsChange = new EventEmitter<ExternalId[]>();
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

  private getIdGroup(id?: ExternalId): FormGroup {
    return this._formBuilder.group({
      value: this._formBuilder.control(id?.value, [
        Validators.required,
        Validators.maxLength(500),
      ]),
      type: this._formBuilder.control(id?.type, Validators.maxLength(50)),
      tag: this._formBuilder.control(id?.tag, Validators.maxLength(50)),
      note: this._formBuilder.control(id?.note, Validators.maxLength(1000)),
    });
  }

  public addId(id?: ExternalId): void {
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

  private updateForm(ids: ExternalId[]): void {
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

  private getIds(): ExternalId[] {
    const ids: ExternalId[] = [];
    for (let i = 0; i < this.idsArr.length; i++) {
      const g = this.idsArr.controls[i] as FormGroup;
      ids.push({
        value: g.controls.value.value?.trim(),
        type: g.controls.type.value?.trim(),
        tag: g.controls.tag.value?.trim(),
        note: g.controls.note.value?.trim(),
      });
    }
    return ids;
  }

  private emitIdsChange(): void {
    this.idsChange.emit(this.getIds());
  }
}
