import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CadmusValidators, ThesaurusEntry } from '@myrmidon/cadmus-core';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

export interface ProperName {
  language: string;
  tag?: string;
  pieces: ProperNamePiece[];
}

export interface ProperNamePiece {
  type: string;
  value: string;
}

/**
 * Proper name real-time editor (cadmus-refs-proper-name).
 * To use, add to the consumer component an initialName property to be
 * bound to name, and handle nameChange to setValue the received name.
 */
@Component({
  selector: 'cadmus-refs-proper-name',
  templateUrl: './proper-name.component.html',
  styleUrls: ['./proper-name.component.css'],
})
export class ProperNameComponent implements OnInit, AfterViewInit, OnDestroy {
  private _name: ProperName | undefined;
  private _updatingForm?: boolean;
  private _pieceSubs: Subscription[];
  private _pieceValueSubscription?: Subscription;

  @ViewChildren('pieceValue') pieceValueQueryList?: QueryList<any>;

  /**
   * The proper name.
   */
  @Input()
  public get name(): ProperName | undefined {
    return this._name;
  }
  public set name(value: ProperName | undefined) {
    this._name = value;
    this.updateForm(value);
  }

  /**
   * The optional thesaurus proper name languages entries.
   */
  @Input()
  public langEntries: ThesaurusEntry[] | undefined;
  /**
   * The optional thesaurus name's tag entries.
   */
  @Input()
  public tagEntries: ThesaurusEntry[] | undefined;
  /**
   * The optional thesaurus name piece's type entries.
   */
  @Input()
  public typeEntries: ThesaurusEntry[] | undefined;

  /**
   * Emitted whenever the name changes.
   */
  @Output()
  public nameChange: EventEmitter<ProperName>;

  public language: FormControl;
  public tag: FormControl;
  public pieces: FormArray;
  public form: FormGroup;

  constructor(private _formBuilder: FormBuilder) {
    this._pieceSubs = [];
    this.nameChange = new EventEmitter<ProperName>();
    // form
    this.language = _formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(50),
    ]);
    this.tag = _formBuilder.control(null, Validators.maxLength(50));
    this.pieces = _formBuilder.array(
      [],
      CadmusValidators.strictMinLengthValidator(1)
    );
    this.form = _formBuilder.group({
      language: this.language,
      tag: this.tag,
      pieces: this.pieces,
    });
  }

  public ngOnInit(): void {
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

  public ngAfterViewInit(): void {
    // focus on newly added piece
    if (this.pieceValueQueryList) {
      this._pieceValueSubscription = this.pieceValueQueryList.changes
        .pipe(debounceTime(300))
        .subscribe((lst: QueryList<any>) => {
          if (!this._updatingForm && lst.length > 0) {
            lst.last.nativeElement.focus();
          }
        });
    }
  }

  private unsubscribePieces(): void {
    for (let i = 0; i < this._pieceSubs.length; i++) {
      this._pieceSubs[i].unsubscribe();
    }
  }

  public ngOnDestroy(): void {
    this.unsubscribePieces();
    this._pieceValueSubscription?.unsubscribe();
  }

  //#region Pieces
  private getPieceGroup(piece?: ProperNamePiece): FormGroup {
    return this._formBuilder.group({
      type: this._formBuilder.control(piece?.type, [
        Validators.required,
        Validators.maxLength(20),
      ]),
      value: this._formBuilder.control(piece?.value, [
        Validators.required,
        Validators.maxLength(50),
      ]),
    });
  }

  public addPiece(piece?: ProperNamePiece): void {
    const g = this.getPieceGroup(piece);
    this._pieceSubs.push(
      g.valueChanges.pipe(debounceTime(300)).subscribe((_) => {
        this.emitNameChange();
      })
    );
    this.pieces.push(g);

    if (!this._updatingForm) {
      this.emitNameChange();
    }
  }

  public removePiece(index: number): void {
    this._pieceSubs[index].unsubscribe();
    this._pieceSubs.splice(index, 1);
    this.pieces.removeAt(index);
    this.emitNameChange();
  }

  private swapArrElems(a: any[], i: number, j: number): void {
    if (i === j) {
      return;
    }
    const t = a[i];
    a[i] = a[j];
    a[j] = t;
  }

  public movePieceUp(index: number): void {
    if (index < 1) {
      return;
    }
    const ctl = this.pieces.controls[index];
    this.pieces.removeAt(index);
    this.pieces.insert(index - 1, ctl);

    this.swapArrElems(this._pieceSubs, index, index - 1);

    this.emitNameChange();
  }

  public movePieceDown(index: number): void {
    if (index + 1 >= this.pieces.length) {
      return;
    }
    const ctl = this.pieces.controls[index];
    this.pieces.removeAt(index);
    this.pieces.insert(index + 1, ctl);

    this.swapArrElems(this._pieceSubs, index, index + 1);

    this.emitNameChange();
  }

  public clearPieces(): void {
    this.pieces.clear();
    this.unsubscribePieces();
    this._pieceSubs = [];
    if (!this._updatingForm) {
      this.emitNameChange();
    }
  }
  //#endregion

  private updateForm(name?: ProperName): void {
    if (!this.language) {
      return;
    }
    if (!name) {
      this.clearPieces();
      this.form.reset();
      return;
    }
    this._updatingForm = true;
    this.clearPieces();

    if (!name) {
      this.form.reset();
    } else {
      this.language.setValue(name.language);
      this.tag.setValue(name.tag);
      this.pieces.clear();
      for (const p of name.pieces || []) {
        this.addPiece(p);
      }
      this.form.markAsPristine();
    }
    this._updatingForm = false;
  }

  private getName(): ProperName {
    const pieces: ProperNamePiece[] = [];

    for (let i = 0; i < this.pieces.length; i++) {
      const g = this.pieces.controls[i] as FormGroup;
      pieces.push({
        type: g.controls.type.value,
        value: g.controls.value.value?.trim(),
      });
    }

    return {
      language: this.language.value,
      tag: this.tag.value,
      pieces: pieces,
    };
  }

  public emitNameChange(): void {
    this.nameChange.emit(this.getName());
  }
}
