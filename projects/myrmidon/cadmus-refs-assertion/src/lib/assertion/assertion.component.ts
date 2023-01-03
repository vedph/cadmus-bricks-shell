import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { DocReference } from '@myrmidon/cadmus-refs-doc-references';
import { debounceTime } from 'rxjs/operators';

export interface Assertion {
  tag?: string;
  rank: number;
  note?: string;
  references?: DocReference[];
}

@Component({
  selector: 'cadmus-refs-assertion',
  templateUrl: './assertion.component.html',
  styleUrls: ['./assertion.component.css'],
})
export class AssertionComponent implements OnInit {
  private _updatingForm: boolean | undefined;
  private _assertion: Assertion | undefined;

  public tag: FormControl<string | null>;
  public rank: FormControl<number>;
  public note: FormControl<string | null>;
  public form: FormGroup;

  public initialReferences: DocReference[];
  public references: DocReference[];

  @Input()
  public assTagEntries?: ThesaurusEntry[];

  @Input()
  public refTypeEntries: ThesaurusEntry[] | undefined;

  @Input()
  public refTagEntries: ThesaurusEntry[] | undefined;

  @Input()
  public get assertion(): Assertion | undefined {
    return this._assertion;
  }
  public set assertion(value: Assertion | undefined) {
    if (this._assertion !== value) {
      this._assertion = value;
      this.updateForm(value);
    }
  }

  @Output()
  public assertionChange: EventEmitter<Assertion | undefined>;

  constructor(formBuilder: FormBuilder) {
    this.initialReferences = [];
    this.references = [];
    this.assertionChange = new EventEmitter<Assertion | undefined>();
    // form
    this.tag = formBuilder.control(null, Validators.maxLength(50));
    this.rank = formBuilder.control(0, { nonNullable: true });
    this.note = formBuilder.control(null, Validators.maxLength(500));
    this.form = formBuilder.group({
      tag: this.tag,
      rank: this.rank,
      note: this.note,
    });
  }

  ngOnInit(): void {
    this.form.valueChanges.pipe(debounceTime(300)).subscribe((_) => {
      if (!this._updatingForm) {
        this.emitAssertionChange();
      }
    });
  }

  public onReferencesChange(references: DocReference[]): void {
    this.references = references;
    this.emitAssertionChange();
  }

  private updateForm(value: Assertion | undefined): void {
    this._updatingForm = true;
    this.initialReferences = [];
    if (!value) {
      this.form.reset();
    } else {
      this.tag.setValue(value.tag || null);
      this.rank.setValue(value.rank);
      this.note.setValue(value.note || null);
      this.initialReferences = value.references || [];
      this.form.markAsPristine();
    }
    this._updatingForm = false;
    // this.emitAssertionChange();
  }

  private getAssertion(): Assertion | undefined {
    const assertion = {
      tag: this.tag.value?.trim(),
      rank: this.rank.value,
      note: this.note.value?.trim(),
      references: this.references,
    };
    if (
      !assertion.tag &&
      !assertion.rank &&
      !assertion.note &&
      !assertion.references?.length
    ) {
      return undefined;
    }
    return assertion;
  }

  public emitAssertionChange(): void {
    this.assertionChange.emit(this.getAssertion());
  }
}
