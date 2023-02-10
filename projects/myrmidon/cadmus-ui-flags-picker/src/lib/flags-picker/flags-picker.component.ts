import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

export interface Flag {
  id: string;
  label: string;
  user?: boolean;
  checked?: boolean;
}

/**
 * A component allowing users to select 1 or more flags (i.e.
 * entries which are either present or absent) from a list.
 * Each flag has a string ID and a human-friendly label, plus
 * a checked state and a user flag indicating whether it has
 * been added by users as a custom flag.
 * Usage: <cadmus-ui-flags-picker
 *        [flags]="flagsArray"
 *        [numbering]="false"
 *        [toolbar]="true"
 *        [allowUserFlags]="true"
 *        (flagsChange)="theHandlerGettingFlags"
 *        ></cadmus-ui-flags-picker>
 */
@Component({
  selector: 'cadmus-ui-flags-picker',
  templateUrl: './flags-picker.component.html',
  styleUrls: ['./flags-picker.component.css'],
})
export class FlagsPickerComponent implements OnInit, OnDestroy {
  private _flags: Flag[];
  private _subs: Subscription[];
  private _changeFrozen?: boolean;

  @Input()
  public get flags(): Flag[] | undefined | null {
    return this._flags;
  }
  public set flags(value: Flag[] | undefined | null) {
    if (this._flags === value) {
      return;
    }
    this._flags = value || [];
    this.updateForm(this._flags);
  }

  /**
   * True to show the ordinal number next to each flag.
   */
  @Input()
  public numbering = false;

  /**
   * True to show a toolbar above the flags.
   */
  @Input()
  public toolbar = true;

  /**
   * True to allow user-defined flags.
   */
  @Input()
  public allowUserFlags = false;

  /**
   * Emitted whenever flags change.
   */
  @Output()
  public flagsChange: EventEmitter<Flag[]>;

  public flagsArr: FormArray;
  public form: FormGroup;

  public userFlag: FormControl<string | null>;
  public userForm: FormGroup;

  constructor(private _formBuilder: FormBuilder) {
    this._flags = [];
    this.flagsChange = new EventEmitter<Flag[]>();
    this._subs = [];
    // form
    this.flagsArr = _formBuilder.array([]);
    this.form = _formBuilder.group({
      flagsArr: this.flagsArr,
    });

    // user
    this.userFlag = _formBuilder.control(null);
    this.userForm = _formBuilder.group({
      userFlag: this.userFlag,
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this._subs.forEach((s) => s.unsubscribe());
  }

  private getFlags(): Flag[] {
    const flags = [...this._flags];
    for (let i = 0; i < this.flagsArr.controls.length; i++) {
      const g = this.flagsArr.at(i) as FormGroup;
      flags[i].checked = g.controls['flag'].value === true;
    }
    return flags;
  }

  private emitFlagsChange(): void {
    this._flags = this.getFlags();
    this.flagsChange.emit(this._flags);
  }

  public addUserFlag(): void {
    if (this.userForm.invalid) {
      return;
    }
    const text = this.userFlag.value?.trim();
    if (!text) {
      return;
    }

    let flag: Flag = {
      id: text,
      label: text,
      user: true,
    };
    flag.checked = true;

    // do not add if the ID already exists
    const flags = this._flags;
    if (flags.some((f) => f.id === flag.id)) {
      return;
    }

    // add flag (checked)
    this._flags = [...this._flags, flag];
    this.flagsArr.controls.push(this.getFlagGroup(true));

    this.userFlag.reset();
    this.userFlag.markAsPristine();

    this.emitFlagsChange();
  }

  private getFlagGroup(checked: boolean): FormGroup {
    const g = this._formBuilder.group({
      flag: this._formBuilder.control<boolean>(checked, { nonNullable: true }),
    });
    this._subs.push(
      g.valueChanges
        .pipe(distinctUntilChanged(), debounceTime(200))
        .subscribe((_) => {
          if (!this._changeFrozen) {
            this.emitFlagsChange();
          }
        })
    );
    return g;
  }

  private updateForm(flags: Flag[]): void {
    this.flagsArr.clear();
    flags.forEach((flag) => {
      this.flagsArr.controls.push(this.getFlagGroup(flag.checked === true));
    });
  }

  public toggleAll(): void {
    this._changeFrozen = true;
    for (let i = 0; i < this.flagsArr.controls.length; i++) {
      const g = this.flagsArr.at(i) as FormGroup;
      g.controls.flag.setValue(!g.controls.flag.value);
    }
    this._changeFrozen = false;
    this.emitFlagsChange();
  }

  public deselectAll(): void {
    this._changeFrozen = true;
    for (let i = 0; i < this.flagsArr.controls.length; i++) {
      const g = this.flagsArr.at(i) as FormGroup;
      g.controls.flag.setValue(false);
    }
    this._changeFrozen = false;
    this.emitFlagsChange();
  }

  public selectAll(): void {
    this._changeFrozen = true;
    for (let i = 0; i < this.flagsArr.controls.length; i++) {
      const g = this.flagsArr.at(i) as FormGroup;
      g.controls.flag.setValue(true);
    }
    this._changeFrozen = false;
    this.emitFlagsChange();
  }

  // public removeFlag(index: number): void {
  //   const flags = [...this._flags$.value];
  //   flags.splice(index, 1);
  //   this._flags$.next(flags);
  //   this.emitFlagsChange();
  // }
}
