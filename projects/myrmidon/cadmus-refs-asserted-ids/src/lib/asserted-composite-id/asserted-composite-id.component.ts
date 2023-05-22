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
import { PinTarget } from '../pin-target-lookup/pin-target-lookup.component';

/**
 * An asserted composite ID. This can be an external ID, having only the ID value
 * as its target.gid property; or a lookup ID, with a pin-based target.
 * In both cases, we can add a tag, a scope, and an assertion.
 */
export interface AssertedCompositeId {
  target: PinTarget;
  tag?: string;
  scope?: string;
  assertion?: Assertion;
}

@Component({
  selector: 'cadmus-refs-asserted-composite-id',
  templateUrl: './asserted-composite-id.component.html',
  styleUrls: ['./asserted-composite-id.component.css'],
})
export class AssertedCompositeIdComponent implements OnInit {
  private _updatingForm: boolean | undefined;
  private _id: AssertedCompositeId | undefined;

  public target: FormControl<PinTarget | null>;
  public scope: FormControl<string | null>;
  public tag: FormControl<string | null>;
  public assertion: FormControl<Assertion | null>;
  public form: FormGroup;

  public targetExpanded: boolean;

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
  public get id(): AssertedCompositeId | undefined | null {
    return this._id;
  }
  public set id(value: AssertedCompositeId | undefined | null) {
    if (this._id !== value) {
      this._id = value || undefined;
      this.updateForm(this._id);
    }
  }

  /**
   * True if the UI has a submit button.
   */
  @Input()
  public hasSubmit: boolean | undefined;

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
   * Emitted whenever the ID changes.
   */
  @Output()
  public idChange: EventEmitter<AssertedCompositeId>;

  /**
   * Emitted whenever the user requests to close the editor.
   */
  @Output()
  public editorClose: EventEmitter<any>;

  constructor(
    formBuilder: FormBuilder,
    public lookupService: PinRefLookupService,
    @Inject('indexLookupDefinitions')
    public lookupDefs: IndexLookupDefinitions
  ) {
    this.target = formBuilder.control(null, Validators.required);
    this.scope = formBuilder.control(null, Validators.maxLength(500));
    this.tag = formBuilder.control(null, Validators.maxLength(50));
    this.assertion = formBuilder.control(null);
    this.form = formBuilder.group({
      target: this.target,
      scope: this.scope,
      tag: this.tag,
      assertion: this.assertion,
    });
    this.targetExpanded = false;
    // events
    this.idChange = new EventEmitter<AssertedCompositeId>();
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

  public onTargetChange(target: PinTarget): void {
    this.target.setValue(target);
    this.target.markAsDirty();
    this.target.updateValueAndValidity();
    this.targetExpanded = false;
  }

  private updateForm(id: AssertedCompositeId | undefined): void {
    this._updatingForm = true;
    if (!id) {
      this.form.reset();
    } else {
      this.target.setValue(id.target);
      this.scope.setValue(id.scope || null);
      this.tag.setValue(id.tag || null);
      this.assertion.setValue(id.assertion || null);
      this.form.markAsPristine();
    }
    this._updatingForm = false;
  }

  private getId(): AssertedCompositeId {
    const external = !this.target.value?.name;
    const target = this.target.value;
    return {
      target: external
        ? {
            gid: target?.gid || '',
            label: target?.label || target?.gid || '',
          }
        : target!,
      scope: this.scope.value?.trim() || '',
      tag: this.tag.value?.trim(),
      assertion: this.assertion.value || undefined,
    };
  }

  public emitIdChange(): void {
    if (!this.hasSubmit) {
      this._id = this.getId();
      this.idChange.emit(this._id);
    }
  }

  public onEditorClose(): void {
    this.targetExpanded = false;
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
