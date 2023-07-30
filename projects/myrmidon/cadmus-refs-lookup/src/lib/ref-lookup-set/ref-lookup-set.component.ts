import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';

import { RefLookupService } from '../ref-lookup/ref-lookup.component';

/**
 * The configuration for each lookup in a lookup set.
 */
export interface RefLookupConfig {
  /**
   * The lookup human-friendly name.
   */
  name: string;

  /**
   * The lookup icon URL.
   */
  iconUrl?: string;

  /**
   * The lookup description.
   */
  description?: string;

  /**
   * The label to be displayed in the lookup control.
   */
  label?: string;

  /**
   * The maximum number of items to retrieve at each lookup.
   * Default is 10.
   */
  limit?: number;

  /**
   * The base filter object to supply when filtering data
   * in this lookup. If you have more filtering criteria
   * set by your client code, set this property to an object
   * representing the filter criteria. This object will be
   * used as the base object when invoking the lookup service.
   */
  baseFilter?: any;

  /**
   * The lookup service to use.
   */
  service?: RefLookupService;

  /**
   * The current lookup item or undefined.
   */
  item?: any;

  /**
   * The optional function to get a string ID from an item.
   * If undefined, the item object will be used.
   * @param item The item to get the label for.
   * @returns The label.
   */
  itemIdGetter?: (item: any) => string;

  /**
   * The optional function to get a string label from an item.
   * If undefined, the item object will be used.
   * @param item The item to get the label for.
   * @returns The label.
   */
  itemLabelGetter?: (item: any) => string;

  /**
   * True if a value is required.
   */
  required?: boolean;

  /**
   * True to add a More button for more complex lookup.
   * When the user clicks it, the corresponding moreRequest
   * event will be emitted.
   */
  hasMore?: boolean;

  /**
   * The optional template to be used when building the
   * URI pointing to the external resource and linked by
   * the Link button. The ID placeholder is represented by
   * a property path included in {}, e.g. {id} or {some.id}.
   * If undefined, no link button will be displayed.
   */
  linkTemplate?: string;

  /**
   * When using quick options, this is a component used to
   * customize the options bound to options.
   */
  optDialog?: any;

  /**
   * The quick options for the lookup service.
   */
  options?: any;
}

/**
 * The icon size used for lookup items.
 */
export interface IconSize {
  width: number;
  height: number;
}

/**
 * The event emitted by the lookup set component.
 */
export interface RefLookupSetEvent {
  configs: RefLookupConfig[];
  config: RefLookupConfig;
  item: any;
  itemId: string;
  itemLabel: string;
}

@Component({
  selector: 'cadmus-ref-lookup-set',
  templateUrl: './ref-lookup-set.component.html',
  styleUrls: ['./ref-lookup-set.component.css'],
})
export class RefLookupSetComponent implements OnInit {
  public config: FormControl<RefLookupConfig | null>;

  /**
   * Configuration for each lookup.
   */
  @Input()
  public configs: RefLookupConfig[];

  /**
   * The icon size used for lookup items.
   */
  @Input()
  public iconSize: IconSize;

  @Output()
  public itemChange: EventEmitter<RefLookupSetEvent>;

  @Output()
  public moreRequest: EventEmitter<RefLookupSetEvent>;

  constructor(formBuilder: FormBuilder) {
    this.configs = [];
    this.iconSize = { width: 24, height: 24 };
    // form
    this.config = formBuilder.control(null);
    // events
    this.itemChange = new EventEmitter<RefLookupSetEvent>();
    this.moreRequest = new EventEmitter<RefLookupSetEvent>();
  }

  public ngOnInit(): void {
    if (this.configs?.length) {
      this.config.setValue(this.configs[0]);
    }
  }

  private eventToItem(item: any): RefLookupSetEvent {
    return {
      configs: this.configs,
      config: this.config.value!,
      item: item,
      itemId: this.config.value!.itemIdGetter
        ? this.config.value!.itemIdGetter(item) || (item as string)
        : (item as string),
      itemLabel: this.config.value!.itemLabelGetter
        ? this.config.value!.itemLabelGetter(item) || (item as string)
        : (item as string),
    };
  }

  public onItemChange(item: any): void {
    if (!this.config.value) {
      return;
    }
    this.itemChange.emit(this.eventToItem(item));
  }

  public onMoreRequest(item: any): void {
    if (!this.config.value) {
      return;
    }
    this.moreRequest.emit(this.eventToItem(item));
  }
}
