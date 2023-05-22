import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { take } from 'rxjs';

import { IndexLookupDefinitions, ThesaurusEntry } from '@myrmidon/cadmus-core';
import { DialogService } from '@myrmidon/ng-mat-tools';

import { AssertedCompositeId } from '../asserted-composite-id/asserted-composite-id.component';

/**
 * Asserted IDs editor.
 */
@Component({
  selector: 'cadmus-refs-asserted-composite-ids',
  templateUrl: './asserted-composite-ids.component.html',
  styleUrls: ['./asserted-composite-ids.component.css'],
})
export class AssertedCompositeIdsComponent {
  private _ids: AssertedCompositeId[];
  private _editedIndex: number;
  public edited?: AssertedCompositeId;

  /**
   * The asserted IDs.
   */
  @Input()
  public get ids(): AssertedCompositeId[] {
    return this._ids;
  }
  public set ids(value: AssertedCompositeId[]) {
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
   * True when the internal UI preselected mode should be by type rather than
   * by item. User can change mode unless modeSwitching is false.
   */
  @Input()
  public pinByTypeMode?: boolean;
  /**
   * True when the user can switch between by-type and by-item mode in
   * the internal UI.
   */
  @Input()
  public canSwitchMode?: boolean;
  /**
   * True when the user can edit the target's gid/label for internal targets.
   */
  @Input()
  public canEditTarget?: boolean;
  /**
   * The lookup definitions to be used for the by-type lookup in the internal UI.
   * If not specified, the lookup definitions will be got via injection
   * when available; if the injected definitions are empty, the
   * lookup definitions will be built from the model-types thesaurus;
   * if this is not available either, the by-type lookup will be
   * disabled.
   */
  @Input()
  public lookupDefinitions?: IndexLookupDefinitions;

  /**
   * Emitted whenever any ID changes.
   */
  @Output()
  public idsChange: EventEmitter<AssertedCompositeId[]>;

  public entries: FormControl<AssertedCompositeId[]>;
  public form: FormGroup;

  constructor(formBuilder: FormBuilder, private _dialogService: DialogService) {
    this._ids = [];
    this._editedIndex = -1;
    this.idsChange = new EventEmitter<AssertedCompositeId[]>();
    this.entries = formBuilder.control([], { nonNullable: true });
    // form
    this.form = formBuilder.group({
      ids: this.entries,
    });
  }

  private updateForm(ids: AssertedCompositeId[]): void {
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
        target: { gid: '', label: '' },
      },
      -1
    );
  }

  public editId(id: AssertedCompositeId, index: number): void {
    this._editedIndex = index;
    this.edited = id;
  }

  public closeId(): void {
    this._editedIndex = -1;
    this.edited = undefined;
  }

  public saveId(entry: AssertedCompositeId): void {
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

  public onIdChange(id: AssertedCompositeId): void {
    this.saveId(id);
    this.emitIdsChange();
  }
}
