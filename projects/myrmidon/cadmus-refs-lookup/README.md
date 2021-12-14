# Cadmus Refs Lookup

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.1.0.

## Lookup Dialog

The lookup dialog is a general purpose lookup where:

- users can type some letters and get a list of matching items to pick from, thus using a quick search;
- the picked item can be 2-way bound with a parent component;
- optionally, users can have a button which opens web resource corresponding to the picked item directly in the browser;
- optionally, users can customize some quick-search options and have them passed to the search service;
- optionally, users can click a `more` button to get to some specialized UI allowing them to pick items with more advanced search criteria.

## Usage

(1) create a **service** acting as an adapter for the quick search by implementing `RefLookupService`. This interface has a `getName` function used to retrieve a user-friendly name from the item model, and a `lookup` function getting a filter implementing `RefLookupFilter`, and returning an observable with a list of matching items. The filter is the minimum required for the lookup, i.e. has a text and a limit (=maximum count of items to return).

For an example, serverless implementation see `WebColorLookup` in the demo app.

This service is then injected into the component hosting the lookup control, and passed to it via its `service` property.

(2) if your service requires **additional options**, just extend `RefLookupFilters` if they are provided by your program. If instead they can be changed by users, create a component representing these options, like  `RefLookupDummyOptComponent` in the demo project.

This component is a normal Angular component, but you should get injected in its constructor:

- `@Inject(MAT_DIALOG_DATA) public data: any`: this gets the data with the options to be changed. Options are stored under the `options` property of `data`.
- `private _dialogRef: MatDialogRef<RefLookupOptionsComponent>`: this gets the reference to the dialog hosting your options component, so that you can use it to close the dialog, returning updated data if required.

Once you have created this options component, the component hosting the lookup control should provide two public properties:

- a property for the options component: e.g. `public optDialog: Type<any> = RefLookupDummyOptComponent;`
- a propeorty for the options data, e.g. `public options: any;`

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

- `hasMore`: true to show the More button to open an advanced search.
- `item`: the currently picked item. The corresponding event is `itemChange`.
- `label`: the label to show in the lookup control.
- `linkTemplate`: a template used to build a full URI which can be visited for the picked item. This template should include between braces the name of the property representing the item's ID for the picked item. This name can also be a path, e.g. it can be `id` or `some.path.to.id`. You can add as many placeholders as you want with the same mechanism.
- `required`: true to make the item selection required. In this case, the lookup control will be wrapped in a red rectangle when no item is selected.

Useful events:

- `itemChange` fired when the user picks an item from the list resulting from a quick search.
- `moreRequest` fired when the user requests the advanced search by clicking the More button. The component hosting the lookup control should handle this event and typically open some dialog with a search, lending back the item to be picked.
