import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { DialogService } from '@myrmidon/ng-mat-tools';
import { take } from 'rxjs';

import { AssertedId } from '../asserted-id/asserted-id.component';

/**
 * Asserted IDs editor.
 */
@Component({
  selector: 'cadmus-refs-asserted-ids',
  templateUrl: './asserted-ids.component.html',
  styleUrls: ['./asserted-ids.component.css'],
})
export class AssertedIdsComponent {
  private _ids: AssertedId[];
  private _editedIndex: number;
  public edited?: AssertedId;

  /**
   * The asserted IDs.
   */
  @Input()
  public get ids(): AssertedId[] {
    return this._ids;
  }
  public set ids(value: AssertedId[]) {
    if (this._ids !== value) {
      this._ids = value || [];
      this.updateForm(value);
    }
  }

  // asserted-id-scopes
  @Input()
  public idScopeEntries?: ThesaurusEntry[];

  // asserted-id-tags
  @Input()
  public idTagEntries?: ThesaurusEntry[];

  // assertion-tags
  @Input()
  public assTagEntries?: ThesaurusEntry[];

  // doc-reference-types
  @Input()
  public refTypeEntries: ThesaurusEntry[] | undefined;

  // doc-reference-tags
  @Input()
  public refTagEntries: ThesaurusEntry[] | undefined;

  /**
   * Emitted whenever any ID changes.
   */
  @Output()
  public idsChange: EventEmitter<AssertedId[]>;

  public entries: FormControl<AssertedId[]>;
  public form: FormGroup;

  constructor(formBuilder: FormBuilder, private _dialogService: DialogService) {
    this._ids = [];
    this._editedIndex = -1;
    this.idsChange = new EventEmitter<AssertedId[]>();
    this.entries = formBuilder.control([], { nonNullable: true });
    // form
    this.form = formBuilder.group({
      ids: this.entries,
    });
  }

  private updateForm(ids: AssertedId[]): void {
    if (!ids?.length) {
      this.form.reset();
      return;
    }
    this.entries.setValue(ids, { emitEvent: false });
    this.entries.updateValueAndValidity();
    this.form.markAsPristine();
  }

  private emitIdsChange(): void {
    this.idsChange.emit(this.entries.value);
  }

  public addId(): void {
    this.editId(
      {
        scope: '',
        value: '',
      },
      -1
    );
  }

  public editId(id: AssertedId, index: number): void {
    this._editedIndex = index;
    this.edited = id;
  }

  public closeId(): void {
    this._editedIndex = -1;
    this.edited = undefined;
  }

  public saveId(entry: AssertedId): void {
    const entries = [...this.entries.value];
    if (this._editedIndex === -1) {
      entries.push(entry);
    } else {
      entries.splice(this._editedIndex, 1, entry);
    }
    this.entries.setValue(entries);
    this.entries.markAsDirty();
    this.entries.updateValueAndValidity();
    this.closeId();
  }

  public deleteId(index: number): void {
    this._dialogService
      .confirm('Confirmation', 'Delete ID?')
      .pipe(take(1))
      .subscribe((yes) => {
        if (yes) {
          if (this._editedIndex === index) {
            this.closeId();
          }
          const entries = [...this.entries.value];
          entries.splice(index, 1);
          this.entries.setValue(entries);
          this.entries.markAsDirty();
          this.entries.updateValueAndValidity();
          this.emitIdsChange();
        }
      });
  }

  public moveIdUp(index: number): void {
    if (index < 1) {
      return;
    }
    const entry = this.entries.value[index];
    const entries = [...this.entries.value];
    entries.splice(index, 1);
    entries.splice(index - 1, 0, entry);
    this.entries.setValue(entries);
    this.entries.markAsDirty();
    this.entries.updateValueAndValidity();
    this.emitIdsChange();
  }

  public moveIdDown(index: number): void {
    if (index + 1 >= this.entries.value.length) {
      return;
    }
    const entry = this.entries.value[index];
    const entries = [...this.entries.value];
    entries.splice(index, 1);
    entries.splice(index + 1, 0, entry);
    this.entries.setValue(entries);
    this.entries.markAsDirty();
    this.entries.updateValueAndValidity();
    this.emitIdsChange();
  }

  public onIdChange(id: AssertedId): void {
    this.saveId(id);
    this.emitIdsChange();
  }
}
