import {
  Component,
  EventEmitter,
  Inject,
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
import {
  Subscription,
  debounceTime,
  distinctUntilChanged,
  forkJoin,
  take,
} from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ItemService, ThesaurusService } from '@myrmidon/cadmus-api';
import {
  DataPinInfo,
  IndexLookupDefinition,
  IndexLookupDefinitions,
  Item,
  Part,
  ThesaurusEntry,
} from '@myrmidon/cadmus-core';

import {
  PinRefLookupFilter,
  PinRefLookupService,
} from '../services/pin-ref-lookup.service';
import { ItemRefLookupService } from '../services/item-ref-lookup.service';

// from Cadmus general parts
const METADATA_PART_ID = 'it.vedph.metadata';
interface MetadataPart extends Part {
  metadata: {
    type?: string;
    name: string;
    value: string;
  }[];
}

/**
 * Pin lookup data used internally by the component.
 */
export interface PinLookupData {
  pin: DataPinInfo;
  item?: Item;
  metaPart?: MetadataPart;
}

/**
 * A pin-based target. This includes pin's name and value, and
 * the item's ID and optional part IDs. The label is a user friendly
 * string representation of the target, while the gid is a globally
 * unique identifier for the target.
 */
export interface PinTarget {
  gid: string;
  label: string;
  itemId?: string;
  partId?: string;
  partTypeId?: string;
  roleId?: string;
  name?: string;
  value?: string;
}

/*
 * Scoped pin-based lookup component. This component provides a list
 * of pin-based searches, with a lookup control. Whenever the user
 * picks a pin value, he gets the details about its item and part, and
 * item's metadata part, if any. He can then use these data to build
 * some EID by variously assembling these components.
 */
@Component({
  selector: 'cadmus-pin-target-lookup',
  templateUrl: './pin-target-lookup.component.html',
  styleUrls: ['./pin-target-lookup.component.css'],
})
export class PinTargetLookupComponent implements OnInit, OnDestroy {
  private _subs: Subscription[];
  private _target: PinTarget | undefined;
  private _noTargetUpdate?: boolean;
  private _startWithByTypeMode?: boolean;

  /**
   * True when the by-type pin lookup mode is active.
   * User can change mode unless modeSwitching is false.
   */
  @Input()
  public get pinByTypeMode(): boolean | undefined {
    return this.byTypeMode?.value;
  }
  public set pinByTypeMode(value: boolean | undefined) {
    if (!this.byTypeMode) {
      this._startWithByTypeMode = value;
    } else {
      this.byTypeMode.setValue(value || false);
      this.byTypeMode.updateValueAndValidity();
    }
  }

  /**
   * True when the user can switch between by-type and by-item mode.
   */
  @Input()
  public canSwitchMode?: boolean;
  /**
   * True when the user can edit the target's gid/label for internal
   * targets.
   */
  @Input()
  public canEditTarget?: boolean;
  /**
   * The lookup definitions to be used for the by-type lookup. If
   * not specified, the lookup definitions will be got via injection
   * when available; if the injected definitions are empty, the
   * lookup definitions will be built from the model-types thesaurus;
   * if this is not available either, the by-type lookup will be
   * disabled.
   */
  @Input()
  public lookupDefinitions?: IndexLookupDefinitions;

  /**
   * True if when a new target is set it should be internal rather than
   * external by default.
   */
  @Input()
  public internalDefault: boolean | undefined;

  /**
   * The target to be edited.
   */
  @Input()
  public get target(): PinTarget | undefined | null {
    return this._target;
  }
  public set target(value: PinTarget | undefined | null) {
    if (this._target === value) {
      return;
    }
    this._target = value || undefined;
    this.updateForm(this._target);
  }

  /**
   * The default value for part type key when the by-type mode is active.
   */
  @Input()
  public defaultPartTypeKey?: string | null;

  /**
   * Emitted when user closes the editor.
   */
  @Output()
  public editorClose: EventEmitter<any>;
  /**
   * Emitted whenever the target changes.
   * The event's value is the new target.
   */
  @Output()
  public targetChange: EventEmitter<PinTarget>;

  // by type
  public modelEntries: ThesaurusEntry[];
  public partTypeKeys: string[];
  // by item
  public itemParts: Part[];
  // form - by item
  public item: FormControl<Item | null>;
  public itemPart: FormControl<Part | null>;
  // form - by type
  public partTypeKey: FormControl<string | null>;
  // form - both
  public gid: FormControl<string | null>;
  public label: FormControl<string | null>;
  public byTypeMode: FormControl<boolean>;
  public external: FormControl<boolean>;
  public form: FormGroup;

  public filter: PinRefLookupFilter;
  public pinFilterOptions?: IndexLookupDefinition;
  public lookupData?: PinLookupData;

  constructor(
    @Inject('indexLookupDefinitions')
    private _presetLookupDefs: IndexLookupDefinitions,
    public itemLookupService: ItemRefLookupService,
    public pinLookupService: PinRefLookupService,
    private _itemService: ItemService,
    private _thesService: ThesaurusService,
    private _snackbar: MatSnackBar,
    formBuilder: FormBuilder
  ) {
    this.partTypeKeys = [];
    this.itemParts = [];
    this._subs = [];
    this.modelEntries = [];
    // this is the default filter for the pin lookup, which will
    // be merged with values provided by user here
    this.filter = {
      text: '',
      limit: 10,
    };
    // form
    this.item = formBuilder.control(null);
    this.itemPart = formBuilder.control(null);
    this.partTypeKey = formBuilder.control(null);
    this.gid = formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(300),
    ]);
    this.label = formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(300),
    ]);
    this.byTypeMode = formBuilder.control(false, { nonNullable: true });
    this.external = formBuilder.control(false, { nonNullable: true });
    this.form = formBuilder.group({
      item: this.item,
      itemPart: this.itemPart,
      partTypeKey: this.partTypeKey,
      gid: this.gid,
      label: this.label,
      byTypeMode: this.byTypeMode,
      external: this.external,
    });
    // events
    this.targetChange = new EventEmitter<PinTarget>();
    this.editorClose = new EventEmitter<any>();
  }

  private forceByItem(): void {
    this.pinByTypeMode = false;
    this.canSwitchMode = false;
  }

  private setupKeys(): void {
    // use DI presets if no lookup definitions
    if (!this.lookupDefinitions) {
      this.lookupDefinitions = this._presetLookupDefs;
    }
    // keys are all the defined lookup searches
    this.partTypeKeys = Object.keys(this.lookupDefinitions);

    // if no keys, get them from thesaurus model-types;
    // if this is not available, just force by item mode.
    if (!this.partTypeKeys.length) {
      if (this.modelEntries?.length) {
        // set lookupDefinitions from thesaurus entries
        this.lookupDefinitions = {};
        this.modelEntries.forEach((e) => {
          this.lookupDefinitions![e.value] = {
            name: e.value,
            typeId: e.id,
          };
        });
        // set type keys from thesaurus entries
        this.partTypeKeys = this.modelEntries.map((e) => e.value);
      }
    }

    // if still no keys, force by item mode
    if (!this.partTypeKeys.length) {
      this.forceByItem();
    } else {
      // set default key
      this.partTypeKey.setValue(
        this.defaultPartTypeKey || this.partTypeKeys[0]
      );
    }
  }

  public ngOnInit(): void {
    // set start mode if required
    if (this._startWithByTypeMode) {
      this.byTypeMode.setValue(true);
    }

    // whenever item changes, update item's parts and filter
    this._subs.push(
      this.item.valueChanges
        .pipe(distinctUntilChanged(), debounceTime(300))
        .subscribe((item) => {
          this.itemPart.setValue(null);
          this.itemParts = item?.parts || [];
          this.filter = {
            ...this.filter,
            itemId: item?.id,
          };
        })
    );

    // whenever itemPart changes, update target and eventually gid
    this._subs.push(
      this.itemPart.valueChanges
        .pipe(distinctUntilChanged(), debounceTime(300))
        .subscribe((part) => {
          if (!this.gid.value || this.gid.pristine) {
            this.gid.setValue(this.buildGid());
          }
          this.filter = {
            ...this.filter,
            partId: part?.id,
          };
          this.updateTarget();
        })
    );

    // whenever partTypeKey changes, update filter's options
    this._subs.push(
      this.partTypeKey.valueChanges
        .pipe(distinctUntilChanged(), debounceTime(300))
        .subscribe((key) => {
          this.pinFilterOptions = key
            ? this.lookupDefinitions![key]
            : undefined;
        })
    );

    // whenever external changes, set required validator in label
    // (true for external, false for internal)
    this._subs.push(
      this.external.valueChanges
        .pipe(distinctUntilChanged(), debounceTime(300))
        .subscribe((external) => {
          if (external) {
            this.label.setValidators([
              Validators.required,
              Validators.maxLength(300),
            ]);
          } else {
            this.label.setValidators([Validators.maxLength(300)]);
          }
          this.label.updateValueAndValidity();
        })
    );

    // load model-types thesaurus entries
    this._thesService.getThesaurus('model-types', true).subscribe({
      next: (t) => {
        this.modelEntries = t.entries || [];
        if (this.modelEntries?.length) {
          this.setupKeys();
        } else {
          this.forceByItem();
        }
      },
      error: () => {
        this.forceByItem();
      },
    });
  }

  public ngOnDestroy(): void {
    for (let i = 0; i < this._subs.length; i++) {
      this._subs[i].unsubscribe();
    }
  }

  private buildGid(): string | null {
    // the GID is the part ID if any, or the item ID, followed by
    // the pin's value (=EID)
    const pin = this.lookupData?.pin;
    if (!pin?.value) {
      return null;
    }
    return pin.partId
      ? `P${pin.partId}/${pin.value}`
      : `I${pin.itemId}/${pin.value}`;
  }

  private buildLabel(): string | null {
    if (!this.lookupData?.pin) {
      return null;
    }
    const sb: string[] = [];
    // pin value
    if (this.lookupData.pin.value) {
      sb.push(this.lookupData.pin.value);
      sb.push(' | ');
    }
    // item title
    sb.push(this.lookupData.item?.title || this.lookupData.pin?.itemId);
    // part type and role
    if (this.lookupData.pin.partTypeId) {
      const e = this.modelEntries?.find(
        (e) => e.id === this.lookupData!.pin.partTypeId
      );
      sb.push(' (');
      sb.push(e?.value || this.lookupData.pin.partTypeId);
      if (this.lookupData.pin.roleId) {
        sb.push(`, ${this.lookupData.pin.roleId}`);
      }
      sb.push(')');
    }
    return sb.join('');
  }

  private getTarget(): PinTarget {
    if (this.external.value) {
      return {
        gid: this.gid.value || '',
        label: this.label.value || '',
      };
    } else {
      const pin = this.lookupData?.pin;
      return {
        gid: this.gid.value || '',
        label: this.label.value || '',
        itemId: pin?.itemId || '',
        partId: pin?.partId || '',
        partTypeId: pin?.partTypeId || '',
        roleId: pin?.roleId || '',
        name: pin?.name || '',
        value: pin?.value || '',
      };
    }
  }

  private updateTarget(): void {
    if (this._noTargetUpdate) {
      return;
    }
    if (!this.external.value) {
      this.gid.setValue(this.buildGid());
      this.gid.updateValueAndValidity();
      this.gid.markAsDirty();
      this.label.setValue(this.buildLabel());
      this.label.updateValueAndValidity();
      this.label.markAsDirty();
    }
    this._target = this.getTarget();
  }

  private updateForm(target?: PinTarget): void {
    // build pin info from target
    if (!target) {
      this.lookupData = undefined;
      this.item.reset();
      this.itemPart.reset();
      this.gid.reset();
      this.label.reset();
      return;
    }
    this._noTargetUpdate = true;
    this.gid.setValue(target.gid || '');
    this.label.setValue(target.label || '');
    this.lookupData = {
      pin: {
        itemId: target.itemId || '',
        partId: target.partId || '',
        partTypeId: target.partTypeId || '',
        roleId: target.roleId || '',
        name: target.name || '',
        value: target.value || '',
      },
    };
    // get item
    if (target.itemId) {
      this._itemService.getItem(target.itemId, true, true).subscribe({
        next: (item) => {
          this.item.setValue(item);
          this.form.markAsPristine();
          this._noTargetUpdate = false;
          this.external.setValue(!target.name);
          this.updateTarget();
        },
        error: (error) => {
          if (error) {
            console.error(JSON.stringify(error));
          }
          this.external.setValue(!target.name);
          this._noTargetUpdate = false;
        },
      });
    } else {
      this.external.setValue(!target.name && !this.internalDefault);
      this._noTargetUpdate = false;
      this.updateTarget();
    }
  }

  /**
   * Called when the item lookup changes (item is looked up
   * by its title).
   *
   * @param item The item got from lookup.
   */
  public onItemLookupChange(item: Item): void {
    // load item's parts
    this._itemService.getItem(item.id, true, true).subscribe({
      next: (i) => {
        // setting the item will trigger its parts update
        this.item.setValue(i);
        this.updateTarget();
      },
      error: (error) => {
        if (error) {
          console.error(JSON.stringify(error));
        }
        this.itemPart.setValue(null);
        this.itemParts = [];
        this.updateTarget();
      },
    });
  }

  private loadItemInfo(pin: DataPinInfo): void {
    forkJoin({
      item: this._itemService.getItem(pin.itemId, false, true),
      part: this._itemService.getPartFromTypeAndRole(
        pin.itemId,
        METADATA_PART_ID,
        undefined,
        true
      ),
    })
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          this.lookupData = {
            pin: pin,
            item: result.item!,
            metaPart: result.part as MetadataPart,
          };
          this.updateTarget();
        },
        error: (error) => {
          this.lookupData = undefined;
          console.error(
            error ? JSON.stringify(error) : 'Error loading item/metadata'
          );
        },
      });
  }

  /**
   * Called when the pin lookup change. A pin is looked up by its
   * name and value (=the filter's text), and optionally by:
   * - its index lookup definition (selected by partTypeKey).
   * - its item (defined by item, in filter).
   * - its part (defined by itemPart, in filter).
   *
   * @param info The pin info from pin lookup.
   */
  public onPinLookupChange(info: DataPinInfo): void {
    this.loadItemInfo(info);
  }

  public onCopied(): void {
    this._snackbar.open('Copied to clipboard', 'OK', {
      duration: 1500,
    });
  }

  public close(): void {
    this.editorClose.emit();
  }

  public save(): void {
    if (this.form.invalid) {
      return;
    }
    this._target = this.getTarget();
    this.targetChange.emit(this._target);
  }
}
