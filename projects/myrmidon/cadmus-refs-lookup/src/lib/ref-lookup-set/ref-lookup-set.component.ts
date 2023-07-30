import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { MessageService } from '../message.service';
import { RefLookupService } from '../ref-lookup/ref-lookup.component';
import { FormBuilder, FormControl } from '@angular/forms';

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

  /**
   * The optional message service used to get events from
   * a set of code-defined lookup components.
   */
  messageService?: MessageService;
}

/**
 * The icon size used for lookup items.
 */
export interface IconSize {
  width: number;
  height: number;
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
  public itemChange: EventEmitter<any>;

  @Output()
  public moreRequest: EventEmitter<RefLookupConfig>;

  constructor(formBuilder: FormBuilder, private _messenger: MessageService) {
    this.configs = [];
    this.iconSize = { width: 24, height: 24 };
    // form
    this.config = formBuilder.control(null);
    // events
    this.itemChange = new EventEmitter<any>();
    this.moreRequest = new EventEmitter<RefLookupConfig>();
  }

  public ngOnInit(): void {
    if (this.configs?.length) {
      this.config.setValue(this.configs[0]);
    }
  }

  public onItemChange(item: any): void {
    this._messenger.send({
      id: 'ITEM-CHANGE',
      payload: {
        config: this.config.value,
        item: item,
      },
    });
    this.itemChange.emit(item);
  }

  public onMoreRequest(item: any): void {
    this._messenger.send({
      id: 'MORE-REQUEST',
      payload: {
        config: this.config.value,
        item: item,
      },
    });
    this.moreRequest.emit(item);
  }
}
