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
  public references: FormControl<DocReference[]>;
  public form: FormGroup;

  // assertion-tags
  @Input()
  public assTagEntries?: ThesaurusEntry[];

  // doc-reference-types
  @Input()
  public refTypeEntries: ThesaurusEntry[] | undefined;

  // doc-reference-tags
  @Input()
  public refTagEntries: ThesaurusEntry[] | undefined;

  @Input()
  public get assertion(): Assertion | undefined | null {
    return this._assertion;
  }
  public set assertion(value: Assertion | undefined | null) {
    if (this._assertion !== value) {
      this._assertion = value || undefined;
      this.updateForm(this._assertion);
    }
  }

  @Output()
  public assertionChange: EventEmitter<Assertion | undefined>;

  constructor(formBuilder: FormBuilder) {
    this.assertionChange = new EventEmitter<Assertion | undefined>();
    // form
    this.tag = formBuilder.control(null, Validators.maxLength(50));
    this.rank = formBuilder.control(0, { nonNullable: true });
    this.note = formBuilder.control(null, Validators.maxLength(500));
    this.references = formBuilder.control([], { nonNullable: true });
    this.form = formBuilder.group({
      tag: this.tag,
      rank: this.rank,
      note: this.note,
      references: this.references,
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
    this.references.setValue(references, { emitEvent: false });
    this.emitAssertionChange();
  }

  private updateForm(value: Assertion | undefined): void {
    this._updatingForm = true;
    if (!value) {
      this.form.reset();
    } else {
      this.tag.setValue(value.tag || null);
      this.rank.setValue(value.rank);
      this.note.setValue(value.note || null);
      this.references.setValue(value.references || []);
      this.form.markAsPristine();
    }
    this._updatingForm = false;
  }

  private getAssertion(): Assertion | undefined {
    const assertion = {
      tag: this.tag.value?.trim(),
      rank: this.rank.value,
      note: this.note.value?.trim(),
      references: this.references.value?.length
        ? this.references.value
        : undefined,
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
    this._assertion = this.getAssertion();
    this.assertionChange.emit(this._assertion);
  }
}
