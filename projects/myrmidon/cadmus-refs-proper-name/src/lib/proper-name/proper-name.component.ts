import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { Assertion } from '@myrmidon/cadmus-refs-assertion';
import { NgToolsValidators } from '@myrmidon/ng-tools';

import { ProperName, ProperNamePiece, TypeThesaurusEntry } from '../models';
import { ProperNameService } from '../services/proper-name.service';

/**
 * A proper name with an assertion.
 */
export interface AssertedProperName extends ProperName {
  assertion?: Assertion;
}

/**
 * Proper name real-time editor (cadmus-refs-proper-name).
 * To use, add to the consumer component an initialName property to be
 * bound to name, and handle nameChange to setValue the received name.
 * This component uses the following conventions for its type thesaurus:
 * - thesaurus can be hierarchical. This happens if any of its entries
 *   IDs contains a dot. In this case, any type can have a list of children
 *   representing the allowed values for it. No further nesting is allowed,
 *   as parent entries represent types, while their children entries
 *   represent type values.
 * - a reserved entry named _order with value equal to a space-delimited
 *   list of entries IDs defines the prescribed order of pieces. When set,
 *   users are not allowed to move pieces up/down in the list, and pieces
 *   are always added in the prescribed order.
 * - entries ending with `*` are unique, i.e. you cannot add more than
 *   a single entry of this type to the pieces.
 */
@Component({
  selector: 'cadmus-refs-proper-name',
  templateUrl: './proper-name.component.html',
  styleUrls: ['./proper-name.component.css'],
})
export class ProperNameComponent implements OnInit {
  private _name: AssertedProperName | undefined;
  // input streams
  private _typeEntries$: BehaviorSubject<ThesaurusEntry[] | undefined>;
  private _name$: BehaviorSubject<AssertedProperName | undefined>;

  public pieceTypes: TypeThesaurusEntry[];
  public editedPieceIndex: number;
  public editedPiece?: ProperNamePiece;

  /**
   * The proper name.
   */
  @Input()
  public get name(): AssertedProperName | undefined | null {
    return this._name;
  }
  public set name(value: AssertedProperName | undefined | null) {
    if (this._name !== value) {
      this._name = value || undefined;
      this._name$.next(this._name);
    }
  }

  /**
   * The optional thesaurus name piece's type entries (name-piece-types).
   */
  @Input()
  public get typeEntries(): ThesaurusEntry[] | undefined {
    return this._typeEntries$.value;
  }
  public set typeEntries(value: ThesaurusEntry[] | undefined) {
    this._typeEntries$.next(value);
  }

  /**
   * The optional thesaurus proper name languages entries (name-languages).
   */
  @Input()
  public langEntries: ThesaurusEntry[] | undefined;
  /**
   * The optional thesaurus name's tag entries (name-tags).
   */
  @Input()
  public tagEntries: ThesaurusEntry[] | undefined;

  // thesauri for assertions
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
   * True to hide the proper name's assertion UI.
   */
  @Input()
  public noAssertion?: boolean;

  /**
   * Emitted whenever the name changes.
   */
  @Output()
  public nameChange: EventEmitter<AssertedProperName | undefined>;

  // main form
  public language: FormControl<string | null>;
  public tag: FormControl<string | null>;
  public pieces: FormControl<ProperNamePiece[]>;
  public assertion: FormControl<Assertion | null>;
  public form: FormGroup;
  // edited assertion
  public assEdOpen: boolean;

  public ordered?: boolean;
  public valueEntries: ThesaurusEntry[];

  constructor(
    formBuilder: FormBuilder,
    private _nameService: ProperNameService
  ) {
    this.nameChange = new EventEmitter<AssertedProperName | undefined>();
    this.assEdOpen = false;
    this.editedPieceIndex = -1;
    this.pieceTypes = [];
    this.valueEntries = [];

    // main form
    this.language = formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(50),
    ]);
    this.tag = formBuilder.control(null, Validators.maxLength(50));
    this.pieces = formBuilder.control([], {
      validators: NgToolsValidators.strictMinLengthValidator(1),
      nonNullable: true,
    });
    this.assertion = formBuilder.control(null);
    this.form = formBuilder.group({
      language: this.language,
      tag: this.tag,
      pieces: this.pieces,
      assertion: this.assertion,
    });

    // streams
    this._typeEntries$ = new BehaviorSubject<ThesaurusEntry[] | undefined>(
      undefined
    );
    this._name$ = new BehaviorSubject<AssertedProperName | undefined>(
      undefined
    );
    // combine types and name together in updating form
    combineLatest({
      types: this._typeEntries$,
      name: this._name$,
    }).subscribe((tn) => {
      this.updateForm(tn.name, tn.types);
    });
  }

  public ngOnInit(): void {
    // any change on name emits event
    this.language.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((_) => {
        this.emitNameChange();
      });
    this.tag.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((_) => {
        this.emitNameChange();
      });
  }

  //#region Pieces
  public editPiece(piece: ProperNamePiece, index: number): void {
    this.editedPieceIndex = index;
    this.editedPiece = piece;
  }

  public addPiece(): void {
    this.editPiece(
      {
        type: this.pieceTypes.length ? this.pieceTypes[0].id : '',
        value: '',
      },
      -1
    );
  }

  public closePiece(): void {
    this.editedPieceIndex = -1;
    this.editedPiece = undefined;
  }

  private getTypeOrdinal(id: string): number {
    return this.pieceTypes.find((t) => t.id === id)?.ordinal || -1;
  }

  private updatePieces(pieces: ProperNamePiece[]): void {
    this.pieces.setValue(pieces);
    this.pieces.markAsDirty();
    this.pieces.updateValueAndValidity();

    this.emitNameChange();
  }

  public savePiece(piece: ProperNamePiece): void {
    const pieces = [...this.pieces.value];

    // just replace if editing an existing piece
    if (this.editedPieceIndex > -1) {
      pieces.splice(this.editedPieceIndex, 1, piece);
      this.updatePieces(pieces);
      this.closePiece();
      return;
    }

    // also replace a single piece if one is already present
    const type = this.pieceTypes.find((t) => t.id === piece.type);
    if (type?.single) {
      const i = this.pieces.value.findIndex((p) => p.type === piece.type);
      if (i > -1) {
        pieces.splice(this.editedPieceIndex, 1, piece);
        this.updatePieces(pieces);
        this.closePiece();
        return;
      }
    }

    // else add: if ordered, insert at the right place; else just append
    if (this.ordered && pieces.length) {
      const n = type?.ordinal || 0;
      const i = n
        ? pieces.findIndex((p) => n < this.getTypeOrdinal(p.type))
        : -1;
      if (i === -1) {
        pieces.push(piece);
      } else {
        pieces.splice(i, 0, piece);
      }
    } else {
      pieces.push(piece);
    }

    this.updatePieces(pieces);
    this.closePiece();
  }

  public removePiece(index: number): void {
    const pieces = [...this.pieces.value];
    pieces.splice(index, 1);
    this.pieces.setValue(pieces);
    this.pieces.markAsDirty();
    this.pieces.updateValueAndValidity();

    if (this.editedPieceIndex === index) {
      this.closePiece();
    }

    this.emitNameChange();
  }

  public movePieceUp(index: number): void {
    if (index < 1) {
      return;
    }
    const pieces = [...this.pieces.value];
    const p = pieces.splice(index, 1)[0];
    pieces.splice(index - 1, 0, p);
    this.pieces.setValue(pieces);
    this.pieces.markAsDirty();
    this.pieces.updateValueAndValidity();
    this.emitNameChange();
  }

  public movePieceDown(index: number): void {
    if (index + 1 >= this.pieces.value.length) {
      return;
    }
    const pieces = [...this.pieces.value];
    const p = pieces.splice(index, 1)[0];
    pieces.splice(index + 1, 0, p);
    this.pieces.setValue(pieces);
    this.pieces.markAsDirty();
    this.pieces.updateValueAndValidity();
    this.emitNameChange();
  }

  public clearPieces(): void {
    this.pieces.setValue([]);
    this.emitNameChange();
  }
  //#endregion

  private updateValueEntries(types: TypeThesaurusEntry[]): void {
    this.valueEntries = this._nameService.getValueEntries(types);
  }

  private updateForm(
    name?: AssertedProperName,
    typeEntries?: ThesaurusEntry[]
  ): void {
    this.closePiece();
    this.assEdOpen = false;

    // no name
    if (!name) {
      this.clearPieces();
      this.form.reset();
      this.pieceTypes = this._nameService.parseTypeEntries(typeEntries);
      this.ordered = this.pieceTypes.some((t) => t.ordinal);
      this.updateValueEntries(this.pieceTypes);
      return;
    }

    // name
    this.clearPieces();
    this.pieceTypes = this._nameService.parseTypeEntries(typeEntries);
    this.ordered = this.pieceTypes.some((t) => t.ordinal);
    this.updateValueEntries(this.pieceTypes);

    this.language.setValue(name.language);
    this.tag.setValue(name.tag || null);
    this.pieces.setValue(name.pieces);
    this.assertion.setValue(name.assertion || null);
    this.form.markAsPristine();
  }

  public onAssertionChange(assertion: Assertion | undefined): void {
    this.assertion.setValue(assertion || null);
    this.assertion.updateValueAndValidity();
    this.assertion.markAsDirty();
  }

  public saveAssertion(): void {
    this.emitNameChange();
    this.assEdOpen = false;
  }

  private getName(): AssertedProperName | undefined {
    if (!this.pieces.value?.length) {
      return undefined;
    }

    return {
      language: this.language.value || '',
      tag: this.tag.value || undefined,
      pieces: this.pieces.value,
      assertion: this.assertion.value || undefined,
    };
  }

  public emitNameChange(): void {
    this._name = this.getName();
    this.nameChange.emit(this._name);
  }
}
