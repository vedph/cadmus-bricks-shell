import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

/**
 * A generic item lookup filter used by RefLookupComponent.
 * You can derive other filters from this interface, which
 * just includes the lookup limit and a text filter.
 */
export interface RefLookupFilter {
  limit: number;
  text: string | undefined;
}

/**
 * The interface to be implemented by lookup services used
 * by RefLookupComponent.
 */
export interface RefLookupService {
  /**
   * Lookup the items matching filter.
   * @param filter The filter.
   */
  lookup<T>(filter: RefLookupFilter): Observable<T[]>;
  /**
   * Get a display name for the specified item.
   * @param item The item.
   */
  getName(item: any | undefined): string;
}

/**
 * Generic reference lookup component. You must set the service
 * property to the lookup service, implementing the LookupService
 * interface, and eventually the current lookup item. Optionally
 * set the label and limit, and hasMore to true if you want a
 * more button for more complex lookup.
 */
@Component({
  selector: 'cadmus-ref-lookup',
  templateUrl: './ref-lookup.component.html',
  styleUrls: ['./ref-lookup.component.css'],
})
export class RefLookupComponent implements OnInit {
  private _service: RefLookupService | undefined;
  private _item: any | undefined;

  public lookupActive: boolean;

  /**
   * The label to be displayed in the lookup control.
   */
  @Input()
  public label: string | undefined;

  /**
   * The maximum number of items to retrieve at each lookup.
   * Default is 10.
   */
  @Input()
  public limit: number;

  /**
   * The lookup service to use.
   */
  @Input()
  public get service(): RefLookupService | undefined {
    return this._service;
  }
  public set service(value: RefLookupService | undefined) {
    const dirty = this._service ? true : false;
    this._service = value;
    if (dirty) {
      this.clear();
    }
  }

  /**
   * The current lookup item or undefined.
   */
  @Input()
  public get item(): any | undefined {
    return this._item;
  }
  public set item(value: any | undefined) {
    this._item = value;
    this.lookup.setValue(value);
  }

  /**
   * Fired whenever an item is picked up.
   */
  @Output()
  public itemChange: EventEmitter<any | null>;

  /**
   * True to add a More button for more complex lookup.
   * When the user clicks it, the corresponding moreRequest
   * event will be emitted.
   */
  @Input()
  public hasMore: boolean | undefined;

  /**
   * The request for a more complex lookup, getting the
   * current item if any.
   */
  @Output()
  public moreRequest: EventEmitter<any | undefined>;

  public form: FormGroup;
  public lookup: FormControl;
  public items$: Observable<any[]>;

  constructor(formBuilder: FormBuilder) {
    this.lookupActive = false;
    this.lookup = formBuilder.control(null);
    this.form = formBuilder.group({
      lookup: this.lookup,
    });

    this.limit = 10;
    this.itemChange = new EventEmitter<any>();
    this.moreRequest = new EventEmitter<any>();

    this.items$ = this.lookup.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value: any | string) => {
        if (typeof value === 'string' && this._service) {
          return this._service.lookup<any>({
            limit: this.limit || 10,
            text: value,
          });
        } else {
          return of([value]);
        }
      })
    );
  }

  ngOnInit(): void {}

  public getLookupName(item: any): string {
    return this._service?.getName(item) || '';
  }

  public clear(): void {
    this.item = undefined;
    this.lookup.reset();
    this.lookupActive = false;
    this.itemChange.emit(null);
  }

  public pickItem(item: any): void {
    this.item = item;
    this.lookupActive = false;
    this.itemChange.emit(item);
  }

  public requestMore(): void {
    this.lookupActive = false;
    this.moreRequest.emit(this.item);
  }
}
