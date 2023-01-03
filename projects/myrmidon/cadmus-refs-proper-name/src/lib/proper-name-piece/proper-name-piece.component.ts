import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  Subscription,
} from 'rxjs';

import { ProperNamePiece, TypeThesaurusEntry } from '../models';

/**
 * Proper name piece editor. This edits a single proper name's piece,
 * including a type and a value, where both can be either a literal
 * value or a thesaurus entity.
 */
@Component({
  selector: 'cadmus-refs-proper-name-piece',
  templateUrl: './proper-name-piece.component.html',
  styleUrls: ['./proper-name-piece.component.css'],
})
export class ProperNamePieceComponent implements OnInit, OnDestroy {
  // input sources to be combined
  private _typeSub?: Subscription;
  private _noNextValuesUpdate?: boolean;
  private _piece$: BehaviorSubject<ProperNamePiece | undefined>;
  private _types$: BehaviorSubject<TypeThesaurusEntry[] | undefined>;

  /**
   * The piece being edited.
   */
  @Input()
  public get piece(): ProperNamePiece | undefined {
    return this._piece$.value;
  }
  public set piece(value: ProperNamePiece | undefined) {
    if (this._piece$.value !== value) {
      console.log(`piece set: ${value?.type}=${value?.value}`);
      this._piece$.next(value);
    }
  }

  /**
   * The available piece types.
   */
  @Input()
  public get types(): TypeThesaurusEntry[] | undefined {
    return this._types$.value;
  }
  public set types(value: TypeThesaurusEntry[] | undefined) {
    if (this._types$.value !== value) {
      console.log('types set: ' + value?.length || 0);
      this._types$.next(value);
    }
  }

  /**
   * Fired when the edited piece changes.
   */
  @Output()
  public pieceChange: EventEmitter<ProperNamePiece>;

  @Output()
  public editorClose: EventEmitter<any>;

  // form
  public type: FormControl<TypeThesaurusEntry | string | null>;
  public value: FormControl<ThesaurusEntry | string | null>;
  public form: FormGroup;

  // the preset values (if any) of the current type
  public typeValues: ThesaurusEntry[];

  constructor(formBuilder: FormBuilder) {
    this.type = formBuilder.control(null, Validators.required);
    this.value = formBuilder.control<ThesaurusEntry | string | null>(
      null,
      Validators.required
    );
    this.form = formBuilder.group({
      type: this.type,
      value: this.value,
    });
    this._piece$ = new BehaviorSubject<ProperNamePiece | undefined>(undefined);
    this._types$ = new BehaviorSubject<TypeThesaurusEntry[] | undefined>(
      undefined
    );
    this.typeValues = [];
    // events
    this.pieceChange = new EventEmitter<ProperNamePiece>();
    this.editorClose = new EventEmitter<any>();
  }

  ngOnInit(): void {
    // combine input changes before updating form
    combineLatest({
      piece: this._piece$,
      types: this._types$,
    }).subscribe((result) => {
      this.updateForm(result.piece, result.types);
    });

    // when type changes, type's values are updated
    this._typeSub = this.type.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((_) => {
        if (!this._noNextValuesUpdate) {
          this.updateTypeValues();
        } else {
          this._noNextValuesUpdate = false;
        }
      });
  }

  ngOnDestroy(): void {
    this._typeSub?.unsubscribe();
  }

  private updateTypeValues(): void {
    // no preset values if no types
    if (!this._types$.value?.length) {
      this.typeValues = [];
    } else {
      // get type's values if any
      const type = this.type.value as TypeThesaurusEntry;
      if (type?.values?.length) {
        this.typeValues = type.values;
      } else {
        this.typeValues = [];
      }
      // if we got values and there is an invalid value, reset it
      if (
        this.typeValues.length &&
        this.value.value &&
        this.typeValues.every((e) => e.id !== this.value.value)
      ) {
        this.value.reset();
      }
    }
  }

  private updateForm(
    piece?: ProperNamePiece,
    types?: TypeThesaurusEntry[]
  ): void {
    if (!piece) {
      this.form.reset();
      return;
    }

    this._noNextValuesUpdate = true;
    // type: TypeThesaurusEntry or string
    const typeEntity = types?.find((t) => t.id === piece!.type);
    this.type.setValue(typeEntity || piece?.type || null);
    this.typeValues = typeEntity?.values || [];

    // value: ThesaurusEntry or string
    this.value.setValue(
      typeEntity?.values?.find((e) => e.id === piece?.value) ||
        piece?.value ||
        null
    );
  }

  public cancel(): void {
    this.editorClose.emit();
  }

  public save(): void {
    if (this.form.invalid) {
      return;
    }
    this.pieceChange.emit({
      type:
        (this.type.value as TypeThesaurusEntry)?.id ||
        (this.type.value as string),
      value:
        (this.value.value as ThesaurusEntry)?.id ||
        (this.value.value as string),
    });
  }
}
