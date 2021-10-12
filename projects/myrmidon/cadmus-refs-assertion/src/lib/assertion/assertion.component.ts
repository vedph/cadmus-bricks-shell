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

  public tag: FormControl;
  public rank: FormControl;
  public note: FormControl;
  public form: FormGroup;
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
    this._assertion = value;
    this.updateForm(value);
  }

  @Output()
  public assertionChange: EventEmitter<Assertion | undefined>;

  constructor(formBuilder: FormBuilder) {
    this.references = [];
    this.assertionChange = new EventEmitter<Assertion | undefined>();
    // form
    this.tag = formBuilder.control(null, Validators.maxLength(50));
    this.rank = formBuilder.control(0);
    this.note = formBuilder.control(null, Validators.maxLength(500));
    this.form = formBuilder.group({
      tag: this.tag,
      rank: this.rank,
      note: this.note,
    });
  }

  ngOnInit(): void {
    this.form.valueChanges.pipe(debounceTime(300)).subscribe((_) => {
      this.emitAssertionChange();
    });
  }

  public onReferencesChange(references: DocReference[]): void {
    if (this.references !== references) {
      this.references = references;
      this.emitAssertionChange();
    }
  }

  private updateForm(value: Assertion | undefined): void {
    this._updatingForm = true;
    this.references = [];
    if (!value) {
      this.form.reset();
    } else {
      this.tag.setValue(value.tag);
      this.rank.setValue(value.rank);
      this.references = value.references || [];
      this.form.markAsPristine();
    }
    this._updatingForm = false;
    this.emitAssertionChange();
  }

  private getAssertion(): Assertion {
    return {
      tag: this.tag.value?.trim(),
      rank: +this.rank.value,
      references: this.references,
    };
  }

  public emitAssertionChange(): void {
    this.assertionChange.emit(this.getAssertion());
  }
}
