import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { Assertion } from '@myrmidon/cadmus-refs-assertion';
import { debounceTime } from 'rxjs/operators';

export interface AssertedId {
  tag?: string;
  value: string;
  scope: string;
  assertion?: Assertion;
}

@Component({
  selector: 'cadmus-refs-asserted-id',
  templateUrl: './asserted-id.component.html',
  styleUrls: ['./asserted-id.component.css'],
})
export class AssertedIdComponent implements OnInit {
  private _updatingForm: boolean | undefined;
  private _id: AssertedId | undefined;

  public tag: FormControl<string | null>;
  public value: FormControl<string | null>;
  public scope: FormControl<string | null>;
  public form: FormGroup;

  public initialAssertion?: Assertion;
  public assertion?: Assertion;

  @Input()
  public scopeEntries?: ThesaurusEntry[];

  @Input()
  public idTagEntries?: ThesaurusEntry[];

  @Input()
  public assTagEntries?: ThesaurusEntry[];

  @Input()
  public refTypeEntries: ThesaurusEntry[] | undefined;

  @Input()
  public refTagEntries: ThesaurusEntry[] | undefined;

  @Input()
  public get id(): AssertedId | undefined {
    return this._id;
  }
  public set id(value: AssertedId | undefined) {
    this._id = value;
    this.updateForm(value);
  }

  @Output()
  public idChange: EventEmitter<AssertedId>;

  constructor(formBuilder: FormBuilder) {
    this.idChange = new EventEmitter<AssertedId>();
    // form
    this.tag = formBuilder.control(null, Validators.maxLength(50));
    this.value = formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(500),
    ]);
    this.scope = formBuilder.control(null, Validators.maxLength(500));
    this.form = formBuilder.group({
      tag: this.tag,
      value: this.value,
      scope: this.scope,
    });
  }

  ngOnInit(): void {
    this.form.valueChanges.pipe(debounceTime(300)).subscribe((_) => {
      if (!this._updatingForm) {
        this.emitIdChange();
      }
    });
  }

  public onAssertionChange(assertion: Assertion | undefined): void {
    this.assertion = assertion;
    setTimeout(() => this.emitIdChange(), 0);
  }

  private updateForm(value: AssertedId | undefined): void {
    this._updatingForm = true;
    if (!value) {
      this.form.reset();
      this.assertion = undefined;
    } else {
      this.tag.setValue(value.tag || null);
      this.value.setValue(value.value);
      this.scope.setValue(value.scope);
      this.initialAssertion = value.assertion;
      this.form.markAsPristine();
    }
    this._updatingForm = false;
    this.emitIdChange();
  }

  private getId(): AssertedId {
    return {
      tag: this.tag.value?.trim(),
      value: this.value.value?.trim() || '',
      scope: this.scope.value?.trim() || '',
      assertion: this.assertion,
    };
  }

  public emitIdChange(): void {
    this.idChange.emit(this.getId());
  }
}
