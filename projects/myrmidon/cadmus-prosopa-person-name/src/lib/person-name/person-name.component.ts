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
import { PersonName, PersonNamePart } from '../person-name';

/**
 * Person name real-time editor (cadmus-prosopa-person-name).
 * To use, add to the consumer component an initialName property to be
 * bound to name, and handle nameChange to setValue the received name.
 */
@Component({
  selector: 'cadmus-prosopa-person-name',
  templateUrl: './person-name.component.html',
  styleUrls: ['./person-name.component.css'],
})
export class PersonNameComponent implements OnInit, AfterViewInit, OnDestroy {
  private _name: PersonName | undefined;
  private _updatingForm?: boolean;
  private _partSubs: Subscription[];
  private _partValueSubscription?: Subscription;

  @ViewChildren('partValue') partValueQueryList?: QueryList<any>;

  /**
   * The person name.
   */
  @Input()
  public get name(): PersonName | undefined {
    return this._name;
  }
  public set name(value: PersonName | undefined) {
    this._name = value;
    this.updateForm(value);
  }

  /**
   * The optional thesaurus person name languages entries.
   */
  @Input()
  public langEntries: ThesaurusEntry[] | undefined;
  /**
   * The optional thesaurus name's tag entries.
   */
  @Input()
  public tagEntries: ThesaurusEntry[] | undefined;
  /**
   * The optional thesaurus name part's type entries.
   */
  @Input()
  public typeEntries: ThesaurusEntry[] | undefined;

  /**
   * Emitted whenever the name changes.
   */
  @Output()
  public nameChange: EventEmitter<PersonName>;

  public language: FormControl;
  public tag: FormControl;
  public parts: FormArray;
  public form: FormGroup;

  constructor(private _formBuilder: FormBuilder) {
    this._partSubs = [];
    this.nameChange = new EventEmitter<PersonName>();
    // form
    this.language = _formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(50),
    ]);
    this.tag = _formBuilder.control(null, Validators.maxLength(50));
    this.parts = _formBuilder.array(
      [],
      CadmusValidators.strictMinLengthValidator(1)
    );
    this.form = _formBuilder.group({
      language: this.language,
      tag: this.tag,
      parts: this.parts,
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
    // focus on newly added part
    if (this.partValueQueryList) {
      this._partValueSubscription = this.partValueQueryList.changes
        .pipe(debounceTime(300))
        .subscribe((lst: QueryList<any>) => {
          if (!this._updatingForm && lst.length > 0) {
            lst.last.nativeElement.focus();
          }
        });
    }
  }

  private unsubscribeParts(): void {
    for (let i = 0; i < this._partSubs.length; i++) {
      this._partSubs[i].unsubscribe();
    }
  }

  public ngOnDestroy(): void {
    this.unsubscribeParts();
    this._partValueSubscription?.unsubscribe();
  }

  //#region Parts
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
    const g = this.getPartGroup(part);
    this._partSubs.push(
      g.valueChanges.pipe(debounceTime(300)).subscribe((_) => {
        this.emitNameChange();
      })
    );
    this.parts.push(g);

    if (!this._updatingForm) {
      this.emitNameChange();
    }
  }

  public removePart(index: number): void {
    this._partSubs[index].unsubscribe();
    this._partSubs.splice(index, 1);
    this.parts.removeAt(index);
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

  public movePartUp(index: number): void {
    if (index < 1) {
      return;
    }
    const ctl = this.parts.controls[index];
    this.parts.removeAt(index);
    this.parts.insert(index - 1, ctl);

    this.swapArrElems(this._partSubs, index, index - 1);

    this.emitNameChange();
  }

  public movePartDown(index: number): void {
    if (index + 1 >= this.parts.length) {
      return;
    }
    const ctl = this.parts.controls[index];
    this.parts.removeAt(index);
    this.parts.insert(index + 1, ctl);

    this.swapArrElems(this._partSubs, index, index + 1);

    this.emitNameChange();
  }

  public clearParts(): void {
    this.parts.clear();
    this.unsubscribeParts();
    this._partSubs = [];
    if (!this._updatingForm) {
      this.emitNameChange();
    }
  }
  //#endregion

  private updateForm(name?: PersonName): void {
    if (!this.language) {
      return;
    }
    if (!name) {
      this.clearParts();
      this.form.reset();
      return;
    }
    this._updatingForm = true;
    this.clearParts();

    if (!name) {
      this.form.reset();
    } else {
      this.language.setValue(name.language);
      this.tag.setValue(name.tag);
      this.parts.clear();
      for (const p of name.parts || []) {
        this.addPart(p);
      }
      this.form.markAsPristine();
    }
    this._updatingForm = false;
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

  public emitNameChange(): void {
    this.nameChange.emit(this.getName());
  }
}
