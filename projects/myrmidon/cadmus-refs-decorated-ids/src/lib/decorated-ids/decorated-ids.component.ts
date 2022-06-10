import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { DocReference } from '@myrmidon/cadmus-refs-doc-references';

/**
 * An ID optionally decorated with rank, tag, and sources.
 */
export interface DecoratedId {
  id: string;
  rank?: number;
  tag?: string;
  sources?: DocReference[];
}

/**
 * Decorated IDs real-time editor.
 * To avoid circular updates, in your container bind ids to initialIds
 * and handle idsChange for ids.setValue.
 */
@Component({
  selector: 'cadmus-refs-decorated-ids',
  templateUrl: './decorated-ids.component.html',
  styleUrls: ['./decorated-ids.component.css'],
})
export class DecoratedIdsComponent implements OnInit {
  private _ids: DecoratedId[];

  public editedIndex: number;
  public editedId: DecoratedId | undefined;
  public editorOpen: boolean;

  public subForm: FormGroup;
  public id: FormControl<string | null>;
  public rank: FormControl<number>;
  public tag: FormControl<string | null>;
  public sources: FormControl<DocReference[]>;
  public form: FormGroup;

  public initialSources: DocReference[];

  @Input()
  public get ids(): DecoratedId[] {
    return this._ids;
  }
  public set ids(value: DecoratedId[]) {
    this._ids = value || [];
    this.closeIdEditor();
  }

  @Input()
  public tagEntries: ThesaurusEntry[] | undefined;
  @Input()
  public docRefTagEntries: ThesaurusEntry[] | undefined;

  @Output()
  public idsChange: EventEmitter<DecoratedId[]>;

  constructor(formBuilder: FormBuilder) {
    this.idsChange = new EventEmitter<DecoratedId[]>();
    this.initialSources = [];
    this._ids = [];
    this.editedIndex = -1;
    this.editorOpen = false;

    this.id = formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(50),
    ]);
    this.rank = formBuilder.control(0, { nonNullable: true });
    this.tag = formBuilder.control(null, Validators.maxLength(50));
    this.sources = formBuilder.control([], { nonNullable: true });
    this.subForm = formBuilder.group({
      id: this.id,
      rank: this.rank,
      tag: this.tag,
      sources: this.sources,
    });
    this.form = formBuilder.group({
      subForm: this.subForm,
    });
  }

  public ngOnInit(): void {
    this.emitChange();
  }

  private closeIdEditor(): void {
    this.editedIndex = -1;
    this.editedId = undefined;
    this.initialSources = [];
    this.subForm?.reset();
    this.subForm?.disable();
    this.editorOpen = false;
  }

  private openIdEditor(id: DecoratedId): void {
    this.subForm.enable();

    this.editedId = id;
    this.initialSources = id.sources || [];
    this.id.setValue(id.id);
    this.rank.setValue(id.rank || 0);
    this.tag.setValue(id.tag || null);

    this.subForm.markAsPristine();
    this.editorOpen = true;
  }

  public addId(): void {
    this.editedIndex = -1;
    this.openIdEditor({ id: '' });
  }

  public editId(index: number): void {
    this.editedIndex = index;
    this.openIdEditor(this.ids[index]);
  }

  private getEditedId(): DecoratedId | null {
    if (!this.editedId) {
      return null;
    }
    return {
      id: this.id.value?.trim() || '',
      rank: this.rank.value || 0,
      tag: this.tag.value?.trim(),
      sources: this.sources.value?.length ? this.sources.value : undefined,
    };
  }

  public deleteId(index: number): void {
    if (this.editedIndex === index) {
      this.closeEditedId();
    }
    this.closeEditedId();
    this.ids.splice(index, 1);
    this.emitChange();
  }

  public onSourcesChange(sources: DocReference[]): void {
    this.sources.setValue(sources);
    this.subForm.markAsDirty();
    this.emitChange();
  }

  public closeEditedId(): void {
    this.closeIdEditor();
  }

  public saveEditedId(): void {
    if (this.subForm.invalid) {
      return;
    }
    const id = this.getEditedId();
    if (!id) {
      return;
    }
    if (this.editedIndex === -1) {
      this.ids.push(id);
    } else {
      this.ids.splice(this.editedIndex, 1, id);
    }
    this.closeEditedId();
    this.emitChange();
  }

  private emitChange(): void {
    this.idsChange.emit(this.ids);
  }
}
