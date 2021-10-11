import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ThesaurusEntry, CadmusValidators } from '@myrmidon/cadmus-core';
import {
  PersonName,
  PersonNamePart,
} from '@myrmidon/cadmus-prosopa-person-name';
import { DecoratedId } from '@myrmidon/cadmus-refs-decorated-ids';
import { DocReference } from '@myrmidon/cadmus-refs-doc-references';

/**
 * A person cited in a documental source, optionally with a set of
 * proposed identifications.
 */
export interface CitedPerson {
  name: PersonName;
  rank?: number;
  ids?: DecoratedId[];
  sources?: DocReference[];
}

@Component({
  selector: 'cadmus-prosopa-cited-person',
  templateUrl: './cited-person.component.html',
  styleUrls: ['./cited-person.component.css'],
})
export class CitedPersonComponent implements OnInit {
  private _person: CitedPerson | undefined;

  @Input()
  public get person(): CitedPerson | undefined {
    return this._person;
  }
  public set person(value: CitedPerson | undefined) {
    this._person = value;
    this.updateForm(value);
  }

  // languages
  @Input()
  public langEntries: ThesaurusEntry[] | undefined;
  // person-name-tags
  @Input()
  public nameTagEntries: ThesaurusEntry[] | undefined;
  // person-name-types
  @Input()
  public nameTypeEntries: ThesaurusEntry[] | undefined;
  // person-id-tags
  @Input()
  public idTagEntries: ThesaurusEntry[] | undefined;

  @Output()
  public personChange: EventEmitter<CitedPerson>;

  @Output()
  public editorClose: EventEmitter<any>;

  public language: FormControl;
  public tag: FormControl;
  public rank: FormControl;
  public parts: FormArray;
  public sources: FormControl;
  public ids: FormControl;
  public form: FormGroup;

  public initialSources: DocReference[];
  public initialIds: DecoratedId[];

  constructor(private _formBuilder: FormBuilder) {
    this.initialSources = [];
    this.initialIds = [];

    // events
    this.personChange = new EventEmitter<CitedPerson>();
    this.editorClose = new EventEmitter<any>();

    // form
    this.language = _formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(50),
    ]);
    this.tag = _formBuilder.control(null, Validators.maxLength(50));
    this.rank = _formBuilder.control(0);
    this.parts = _formBuilder.array(
      [],
      CadmusValidators.strictMinLengthValidator(1)
    );
    this.sources = _formBuilder.control([]);
    this.ids = _formBuilder.control([]);

    // this is the parent form for both name and ids
    this.form = _formBuilder.group({
      language: this.language,
      tag: this.tag,
      rank: this.rank,
      parts: this.parts,
      sources: this.sources,
      ids: this.ids,
    });
  }

  public ngOnInit(): void {
    if (this._person) {
      this.updateForm(this._person);
    }
  }

  private updateForm(model: CitedPerson | undefined): void {
    this.initialIds = model?.ids || [];
    this.initialSources = model?.sources || [];

    if (!model) {
      this.form.reset();
    } else {
      this.language.setValue(model.name?.language);
      this.tag.setValue(model.name?.tag);
      this.rank.setValue(model.rank);
      this.parts.clear();
      for (const p of model.name?.parts || []) {
        this.addPart(p);
      }
      this.form.markAsPristine();
    }
  }

  private getName(): PersonName {
    const parts: PersonNamePart[] = [];

    for (let i = 0; i < this.parts.length; i++) {
      const g = this.parts.controls[i] as FormGroup;
      parts.push({
        type: g.controls.type.value,
        value: g.controls.value.value?.trim(),
      });
    }

    return {
      language: this.language.value,
      tag: this.tag.value,
      parts,
    };
  }

  private getPerson(): CitedPerson {
    return {
      name: this.getName(),
      rank: this.rank.value,
      ids: this.ids.value?.length ? this.ids.value : undefined,
      sources: this.sources.value?.length ? this.sources.value : undefined,
    };
  }

  // #region Parts
  private getPartGroup(part?: PersonNamePart): FormGroup {
    return this._formBuilder.group({
      type: this._formBuilder.control(part?.type, [
        Validators.required,
        Validators.maxLength(20),
      ]),
      value: this._formBuilder.control(part?.value, [
        Validators.required,
        Validators.maxLength(50),
      ]),
    });
  }

  public addPart(part?: PersonNamePart): void {
    this.parts.push(this.getPartGroup(part));
  }

  public removePart(index: number): void {
    this.parts.removeAt(index);
  }

  public movePartUp(index: number): void {
    if (index < 1) {
      return;
    }
    const item = this.parts.controls[index];
    this.parts.removeAt(index);
    this.parts.insert(index - 1, item);
  }

  public movePartDown(index: number): void {
    if (index + 1 >= this.parts.length) {
      return;
    }
    const item = this.parts.controls[index];
    this.parts.removeAt(index);
    this.parts.insert(index + 1, item);
  }

  public clearParts(): void {
    this.parts.clear();
  }
  // #endregion

  public onIdsChange(ids: DecoratedId[]): void {
    this.ids.setValue(ids);
    this.form.markAsDirty();
  }

  public onSourcesChange(sources: DocReference[]): void {
    this.sources.setValue(sources);
    this.form.markAsDirty();
  }

  public cancel(): void {
    this.editorClose.emit();
  }

  public save(): void {
    if (this.form.invalid) {
      return;
    }
    const model = this.getPerson();
    this.personChange.emit(model);
  }
}
