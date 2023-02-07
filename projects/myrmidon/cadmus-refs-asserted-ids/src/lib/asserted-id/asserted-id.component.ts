import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

import { IndexLookupDefinitions, ThesaurusEntry } from '@myrmidon/cadmus-core';
import { Assertion } from '@myrmidon/cadmus-refs-assertion';

import { PinRefLookupService } from '../services/pin-ref-lookup.service';

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
  public assertion: FormControl<Assertion | null>;
  public form: FormGroup;

  public lookupExpanded: boolean;

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

  @Input()
  public get id(): AssertedId | undefined | null {
    return this._id;
  }
  public set id(value: AssertedId | undefined | null) {
    if (this._id !== value) {
      this._id = value || undefined;
      this.updateForm(this._id);
    }
  }

  /**
   * True to hide the pin-based EID lookup UI.
   */
  @Input()
  public noEidLookup: boolean | undefined;

  @Input()
  public hasSubmit: boolean | undefined;

  @Output()
  public idChange: EventEmitter<AssertedId>;

  @Output()
  public editorClose: EventEmitter<any>;

  constructor(
    formBuilder: FormBuilder,
    public lookupService: PinRefLookupService,
    @Inject('indexLookupDefinitions')
    public lookupDefs: IndexLookupDefinitions
  ) {
    this.tag = formBuilder.control(null, Validators.maxLength(50));
    this.value = formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(500),
    ]);
    this.scope = formBuilder.control(null, Validators.maxLength(500));
    this.assertion = formBuilder.control(null);
    this.form = formBuilder.group({
      tag: this.tag,
      value: this.value,
      scope: this.scope,
      assertion: this.assertion
    });
    this.lookupExpanded = false;
    // events
    this.idChange = new EventEmitter<AssertedId>();
    this.editorClose = new EventEmitter<any>();
  }

  ngOnInit(): void {
    this.form.valueChanges.pipe(debounceTime(300)).subscribe((_) => {
      if (!this._updatingForm) {
        this.emitIdChange();
      }
    });
  }

  public onAssertionChange(assertion: Assertion | undefined): void {
    this.assertion.setValue(assertion || null);
  }

  public onIdPick(id: string): void {
    this.value.setValue(id);
    this.value.markAsDirty();
    this.value.updateValueAndValidity();
    this.lookupExpanded = false;
  }

  private updateForm(value: AssertedId | undefined): void {
    this._updatingForm = true;
    if (!value) {
      this.form.reset();
    } else {
      this.tag.setValue(value.tag || null);
      this.value.setValue(value.value);
      this.scope.setValue(value.scope);
      this.assertion.setValue(value.assertion || null);
      this.form.markAsPristine();
    }
    this._updatingForm = false;
    // this.emitIdChange();
  }

  private getId(): AssertedId {
    return {
      tag: this.tag.value?.trim(),
      value: this.value.value?.trim() || '',
      scope: this.scope.value?.trim() || '',
      assertion: this.assertion.value || undefined,
    };
  }

  public emitIdChange(): void {
    if (!this.hasSubmit) {
      this._id = this.getId();
      this.idChange.emit(this._id);
    }
  }

  public cancel(): void {
    this.editorClose.emit();
  }

  public save(): void {
    if (this.form.valid) {
      this._id = this.getId();
      this.idChange.emit(this._id);
    }
  }
}
