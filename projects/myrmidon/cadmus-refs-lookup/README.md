# Cadmus Refs Lookup

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.1.0.

## Lookup

The lookup component is a general purpose lookup where:

- users can type some letters and get a list of matching items to pick from, thus using a quick search;
- the picked item can be 2-way bound with a parent component;
- optionally, users can have a button which opens web resource corresponding to the picked item directly in the browser;
- optionally, users can customize some quick-search options and have them passed to the search service;
- optionally, users can click a `more` button to get to some specialized UI allowing them to pick items with more advanced search criteria.

### Usage

(1) create a **service** acting as an adapter for the quick search by implementing `RefLookupService`. This interface has a `getName` function used to retrieve a user-friendly name from the item model, and a `lookup` function getting a filter implementing `RefLookupFilter`, and returning an observable with a list of matching items. The filter is the minimum required for the lookup, i.e. has a text and a limit (=maximum count of items to return).

For an example, serverless implementation see [WebColorLookup](../../../src/app/refs/ref-lookup-pg/ref-lookup-pg.component.ts) in the demo app.

This service is then injected into the component hosting the lookup control, and passed to it via its `service` property.

(2) if your service requires **additional options**, just extend `RefLookupFilters` if they are provided by your program. In this case, typically your code will set the lookup's component `baseFilter` property so that it represents the additional filter criteria you want to preset. If instead the additional options can be changed by users, create a component representing these options, like  `RefLookupDummyOptComponent` in the demo project.

This component is a normal Angular component, but you should get injected in its constructor:

- `@Inject(MAT_DIALOG_DATA) public data: any`: this gets the data with the options to be changed. Options are stored under the `options` property of `data`.
- `private _dialogRef: MatDialogRef<RefLookupOptionsComponent>`: this gets the reference to the dialog hosting your options component, so that you can use it to close the dialog, returning updated data if required.

Once you have created this options component, the component hosting the lookup control should provide two public properties:

- a property for the options component: e.g. `public optDialog: Type<any> = RefLookupDummyOptComponent;`
- a property for the options data, e.g. `public options: any;`

These must then be bound to the lookup control, e.g.:

```html
<cadmus-ref-lookup
  [service]="service"
  [item]="item"
  [required]="true"
  [hasMore]="true"
  [optDialog]="optDialog"
  [options]="options"
  linkTemplate="http://www.colors.org/web-{name}.html"
  label="color"
  (itemChange)="onItemChange($event)"
  (moreRequest)="onMoreRequest()"
></cadmus-ref-lookup>
```

Once this is in place, when the user clicks the options button he gets to a dialog with your options component. The options are then passed to the adapter service together with the filter whenever a search is requested.

(3) apart from the required properties `service` (and `optDialog` and `options` for user-defined options), when using your control you can also set:

- `baseFilter`: an object to be augmented with `text` and `limit` by the lookup component when fetching data from its service. This can contain additional filtering criteria, preset by your consumer code.
- `hasMore`: true to show the More button to open an advanced search.
- `item`: the currently picked item. The corresponding event is `itemChange`.
- `label`: the label to show in the lookup control.
- `linkTemplate`: a template used to build a full URI which can be visited for the picked item. This template should include between braces the name of the property representing the item's ID for the picked item. This name can also be a path, e.g. it can be `id` or `some.path.to.id`. You can add as many placeholders as you want with the same mechanism.
- `required`: true to make the item selection required. In this case, the lookup control will be wrapped in a red rectangle when no item is selected.

Useful events:

- `itemChange` fired when the user picks an item from the list resulting from a quick search.
- `moreRequest` fired when the user requests the advanced search by clicking the *More* button. The component hosting the lookup control should handle this event and typically open some dialog with a search, lending back the item to be picked.

## Lookup Set

A lookup set is a combination of several lookup components, each connected to a different source.

Each lookup is **configured** via an instance of `RefLookupConfig`, having these properties:

- `name`: a human-friendly name for the lookup. Users will pick from a list displaying this name for each configuration.
- `iconUrl`: an optional icon URL to be displayed next to the name in the list. Icon size is specified by the `iconSize` property of the lookup set.
- `description`: a lookup description.
- `label`: the label to be displayed in the lookup control.
- `limit`: the maximum number of items to retrieve at each lookup. Default is 10.
- `baseFilter`: the base filter object to supply when filtering data in this lookup. If you have more filtering criteria set by your client code, set this property to an object representing the filter criteria. This object will be used as the base object when invoking the lookup service.
- `service`: the lookup service to use.
- `item`: the current lookup item, or undefined to start the lookup blank.
- `itemIdGetter`: the optional function to get a string ID from an item. If undefined, the `item` object will be used.
- `itemLabelGetter`: the optional function to get a string label from an item.If undefined, the item object will be used.
- `required`: true if a value is required.
- `hasMore`: true to add a "More" button for more complex lookup. When the user clicks it, the corresponding `moreRequest` event will be emitted.
- `linkTemplate`: the optional template to be used when building the URI pointing to the external resource and linked by the Link button. The ID placeholder is represented by a property path included in `{}`, e.g. `{id}` or `{some.id}`. If undefined, no link button will be displayed.
- optDialog: when using quick options, this is a component used to customize the options bound to options.
- `options`: the options for the lookup service.

The **set component** has these properties:

- `configs`: an array of configuration objects as illustrated above.
- `iconSize`: the size of the icons to use in the lookups list. Default is 24x24.

The events are:

- `itemChange`: emitted when an item is picked.
- `moreRequest`: emitted when a more request is issued.

Both these events provide the picked item, wrapped into a set of metadata:

- `configs`: the array of configurations used.
- `config`: the current config.
- `item`: the picked item.
- `itemId`: the ID of the picked item.
- `itemLabel`: the label of the picked item.
