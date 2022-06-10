import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

export interface Flag {
  id: string;
  label: string;
  user?: boolean;
}

/**
 * A component allowing users to select 1 or more flags (i.e.
 * entries which are either present or absent) from a list.
 * Each flag has a string ID and a human-friendly label.
 * Usage: <cadmus-ui-flags-picker
 *        [selectedIds]="arrayOfSelectedIds"
 *        [flags]="arrayOfAvailableFlags"
 *        [numbering]="false"
 *        [toolbar]="true"
 *        [allowUserFlags]="true"
 *        (selectedIdsChange)="theHandlerGettingIdsArray"
 *        (flagsChange)="theHandlerGettingFlags"
 *        ></cadmus-ui-flags-picker>
 */
@Component({
  selector: 'cadmus-ui-flags-picker',
  templateUrl: './flags-picker.component.html',
  styleUrls: ['./flags-picker.component.css'],
})
export class FlagsPickerComponent implements OnInit, OnDestroy {
  private _data$: BehaviorSubject<{
    selectedIds: string[];
    flags: Flag[];
  }>;
  private _subs: Subscription[];
  private _changeFrozen?: boolean;

  /**
   * The IDs of the selected flags.
   */
  @Input()
  public get selectedIds(): string[] | undefined {
    return this._data$.value.selectedIds;
  }
  public set selectedIds(value: string[] | undefined) {
    this._data$.next({
      selectedIds: value || [],
      flags: this._data$.value.flags,
    });
  }

  /**
   * All the available flags.
   */
  @Input()
  public get flags(): Flag[] | undefined {
    return this._data$.value.flags;
  }
  public set flags(value: Flag[] | undefined) {
    this._data$.next({
      selectedIds: this._data$.value.selectedIds,
      flags: value || [],
    });
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
   * Emitted whenever selected IDs change.
   */
  @Output()
  public selectedIdsChange: EventEmitter<string[]>;

  /**
   * Emitted when a new flag has been added by user.
   */
  @Output()
  public flagsChange: EventEmitter<Flag[]>;

  public flagsArr: FormArray;
  public form: FormGroup;

  public userFlag: FormControl<string | null>;
  public userForm: FormGroup;

  constructor(private _formBuilder: FormBuilder) {
    this._data$ = new BehaviorSubject<{
      selectedIds: string[];
      flags: Flag[];
    }>({ selectedIds: [], flags: [] });
    this.selectedIdsChange = new EventEmitter<string[]>();
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

  ngOnInit(): void {
    this._data$.subscribe((_) => {
      this.updateForm();
    });
    this.emitIdsChange();
  }

  ngOnDestroy(): void {
    this._subs.forEach((s) => s.unsubscribe());
    this._data$.unsubscribe();
  }

  public addUserFlag(): void {
    if (this.userForm.invalid) {
      return;
    }
    const text = this.userFlag.value?.trim();
    if (!text) {
      return;
    }

    // parse id=label
    const i = text.indexOf('=');
    let flag: Flag;
    if (i === -1) {
      flag = {
        id: text,
        label: text,
        user: true,
      };
    } else {
      flag = {
        id: text.substring(0, i),
        label: text.substring(i + 1),
        user: true,
      };
    }

    // do not add if the ID/label already exists
    const flags = this._data$.value.flags;
    if (flags.some((f) => f.id === flag.id || f.label === flag.label)) {
      return;
    }

    // add flag (checked)
    this._data$.next({
      selectedIds: [...this._data$.value.selectedIds, flag.id],
      flags: [...flags, flag],
    });

    this.userFlag.reset();
    this.userFlag.markAsPristine();

    this.flagsChange.emit(this._data$.value.flags);
    this.emitIdsChange();
  }

  private getFlagGroup(selected: boolean): FormGroup {
    const g = this._formBuilder.group({
      flag: this._formBuilder.control(selected),
    });
    this._subs.push(
      g.valueChanges
        .pipe(distinctUntilChanged(), debounceTime(200))
        .subscribe((_) => {
          if (!this._changeFrozen) {
            this.selectedIdsChange.emit(this.getSelectedIds());
          }
        })
    );
    return g;
  }

  private updateForm(): void {
    this.flagsArr.clear();
    const flags = this._data$.value.flags;
    const ids = this._data$.value.selectedIds;
    if (flags.length) {
      flags.forEach((flag) => {
        this.flagsArr.controls.push(this.getFlagGroup(ids.includes(flag.id)));
      });
    }
  }

  private getSelectedIds(): string[] {
    const selectedIds: string[] = [];
    const flags = this._data$.value.flags;
    for (let i = 0; i < this.flagsArr.controls.length; i++) {
      const g = this.flagsArr.at(i) as FormGroup;
      if (g.controls.flag.value) {
        selectedIds.push(flags[i].id);
      }
    }
    return selectedIds;
  }

  public toggleAll(): void {
    this._changeFrozen = true;
    for (let i = 0; i < this.flagsArr.controls.length; i++) {
      const g = this.flagsArr.at(i) as FormGroup;
      g.controls.flag.setValue(!g.controls.flag.value);
    }
    this._changeFrozen = false;
    this.emitIdsChange();
  }

  public deselectAll(): void {
    this._changeFrozen = true;
    for (let i = 0; i < this.flagsArr.controls.length; i++) {
      const g = this.flagsArr.at(i) as FormGroup;
      g.controls.flag.setValue(false);
    }
    this._changeFrozen = false;
    this.emitIdsChange();
  }

  public selectAll(): void {
    this._changeFrozen = true;
    for (let i = 0; i < this.flagsArr.controls.length; i++) {
      const g = this.flagsArr.at(i) as FormGroup;
      g.controls.flag.setValue(true);
    }
    this._changeFrozen = false;
    this.emitIdsChange();
  }

  public onRemoveFlag(index: number): void {
    const flag = this._data$.value.flags[index];

    // emit ids change if the flag being removed involved it
    const ids = this.getSelectedIds();
    const i = ids.indexOf(flag.id);
    if (i > -1) {
      ids.splice(i, 1);
      this.selectedIdsChange.emit(ids);
    }

    // remove flag
    const flags = [...this._data$.value.flags];
    flags.splice(index, 1);
    this._data$.next({
      ...this._data$.value,
      flags: flags,
    });

    this.flagsChange.emit(flags);
  }

  private emitIdsChange(): void {
    this.selectedIdsChange.emit(this.getSelectedIds());
  }
}
