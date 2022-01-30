import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

export interface Flag {
  id: string;
  label: string;
}

/**
 * A component allowing users to select 1 or more flags (i.e.
 * entries which are either present or absent) from a list.
 * Each flag has a string ID and a human-friendly label.
 * Usage: <cadmus-ui-flags-picker
 *        [selectedIds]="arrayOfSelectedIds"
 *        [flags]="arrayOfAvailableFlags"
 *        [numbering]="false"
 *        [toolbar]="false"
 *        (selectedIdsChange)="theHandlerGettingIdsArray"
 *        ></cadmus-ui-flags-picker>
 */
@Component({
  selector: 'cadmus-ui-flags-picker',
  templateUrl: './flags-picker.component.html',
  styleUrls: ['./flags-picker.component.css'],
})
export class FlagsPickerComponent implements OnInit, OnDestroy {
  private _ids: string[];
  private _flags: Flag[];
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
    return this._ids;
  }
  public set selectedIds(value: string[] | undefined) {
    this._ids = value || [];
    this._data$.next({
      selectedIds: this._ids,
      flags: this._flags,
    });
  }

  /**
   * All the available flags.
   */
  @Input()
  public get flags(): Flag[] | undefined {
    return this._flags;
  }
  public set flags(value: Flag[] | undefined) {
    this._flags = value || [];
    this._data$.next({
      selectedIds: this._ids,
      flags: this._flags,
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
   * Emitted whenever selected IDs change.
   */
  @Output()
  public selectedIdsChange: EventEmitter<string[]>;

  public flagsArr: FormArray;
  public form: FormGroup;

  constructor(private _formBuilder: FormBuilder) {
    this._ids = [];
    this._flags = [];
    this._data$ = new BehaviorSubject<{
      selectedIds: string[];
      flags: Flag[];
    }>({ selectedIds: [], flags: [] });
    this.selectedIdsChange = new EventEmitter<string[]>();
    this._subs = [];
    // form
    this.flagsArr = _formBuilder.array([]);
    this.form = _formBuilder.group({
      flagsArr: this.flagsArr,
    });
  }

  ngOnInit(): void {
    this._data$.subscribe((_) => {
      this.updateForm();
    });
  }

  ngOnDestroy(): void {
    this._subs.forEach((s) => s.unsubscribe());
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
    if (this._flags?.length) {
      this._flags.forEach((flag) => {
        this.flagsArr.controls.push(
          this.getFlagGroup(this._ids?.includes(flag.id))
        );
      });
    }
  }

  private getSelectedIds(): string[] {
    const selectedIds: string[] = [];
    for (let i = 0; i < this.flagsArr.controls.length; i++) {
      const g = this.flagsArr.at(i) as FormGroup;
      if (g.controls.flag.value) {
        selectedIds.push(this._flags[i].id);
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
    this.selectedIdsChange.emit(this.getSelectedIds());
  }

  public deselectAll(): void {
    this._changeFrozen = true;
    for (let i = 0; i < this.flagsArr.controls.length; i++) {
      const g = this.flagsArr.at(i) as FormGroup;
      g.controls.flag.setValue(false);
    }
    this._changeFrozen = false;
    this.selectedIdsChange.emit(this.getSelectedIds());
  }

  public selectAll(): void {
    this._changeFrozen = true;
    for (let i = 0; i < this.flagsArr.controls.length; i++) {
      const g = this.flagsArr.at(i) as FormGroup;
      g.controls.flag.setValue(true);
    }
    this._changeFrozen = false;
    this.selectedIdsChange.emit(this.getSelectedIds());
  }
}
