# CadmusUiFlagsPicker

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.0.

The flags picker allows to select 1 or more flags (i.e. entries which are either present or absent) from a list. Each flag has a string ID and a human-friendly label, and implements interface `Flag`. Optionally users can add new flags to the list.

## API

Each flag has:

- `id`: the ID for this flag.
- `label`: the human-friendly label for this flag.
- `user`: optionally set to true when this flag was added by user.

Component's properties:

- `flags`: the flags.
- `numbering`: true to show an ordinal number next to each flag.
- `toolbar`: true to show the toolbar including quick selection buttons and the UI for adding new flags.
- `allowUserFlags`: true to allow users add new flags.

Component's events:

- `flagsChange`: emitted when flags have changed.

## Adapter

A typical usage scenario for this brick in Cadmus is providing a multiple-selection list of entries from a thesaurus. In this case, you can take advantage of the `FlagsPickerAdapter`, which is designed for a scenario where:

- your component has any number of flags sets to handle, each fed by a thesaurus.
- you cannot determine the order in which the flags or their check states are set by the host component into the flags brick component. So, it might happen that flags definitions from thesauri are set first, and then their checked states are updated from the model being edited; or vice-versa. You thus need a way of allowing any order while keeping this information in synch.

The adapter sits between the flags brick and its consumer. The brick's `flags` property is bound to an observable got from the adapter for a specific set of flags; and the `flagsChange` event handler notifies the adapter of user changes via `setSlotFlags`. In turn, the consumer component sets the available flags and their initial checked states, usually drawing the former from a thesaurus and the latter from the model it handles.

The typical procedure for using an adapter is illustrated below. It assumes that:

- you have 1 or more flags set, each fed by a thesaurus.
- you save the flags in a form's control. As for the adapter, this is redundant, because the adapter already keeps track of flags; yet, it's often useful to have a form's control representing the flags, to correctly handle dirty state and validation. So, we just save the flags also in this control, when present.

(1) just to save some typing, create an adapter function to convert thesaurus entries to flags:

```ts
function entryToFlag(entry: ThesaurusEntry): Flag {
  return {
    id: entry.id,
    label: entry.value,
  };
}
```

(2) add a readonly flags adapter member to your component, and a `...Flags$` observable property for each flags set:

```ts
private readonly _flagAdapter: FlagsPickerAdapter;

// flags
public stateFlags$: Observable<Flag[]>;

// in constructor:
// flags
this._flagAdapter = new FlagsPickerAdapter();
// TODO: instantiate each set of flags using a key ID, e.g.:
this.stateFlags$ = this._flagAdapter.selectFlags('states');
```

(3) in your entries property setter, use the adapter to set the corresponding flags, e.g.:

```ts
// cod-content-states
@Input()
public get stateEntries(): ThesaurusEntry[] | undefined {
  return this._stateEntries;
}
public set stateEntries(value: ThesaurusEntry[] | undefined) {
  if (this._stateEntries === value) {
    return;
  }
  this._stateEntries = value || [];
  this._flagAdapter.setSlotFlags(
    'states',
    this._stateEntries.map(entryToFlag)
  );
}
```

(4) if you want to let the form properly handle dirty state and validation, in your form have a control for the flags, e.g. `public states: FormControl<Flag[]>`, and instantiate it as any other form item.

(5) in your `updateForm` function, set the flag IDs via the adapter. Note that we deal only with the adapter, as the control will be automatically set when the flags brick fires back its flags change event:

```ts
//update form
this._flagAdapter.setSlotChecks('states', content.states);
```

(6) conversely, in your `getModel` function, get the IDs of the checked flags from the adapter:

```ts
// get model
// ...
states: this._flagAdapter.getOptionalCheckedFlagIds('states'),
```

>The `getFlagIds` and `getOptionalFlagIds` methods are used to extract the IDs of the checked flags only, returning an array which is empty when no flag is checked, or undefined, according to the method called.

(7) handle the `flagsChange` event from the flags component to update the form's control. Note that when we receive a change event from the brick control, we need to update both the checked states for the flags, and the flags themselves, as there might be user-defined flags. So we are using the adapter's setSlotFlags method with a true parameter to tell it that the checked states must be drawn from the received flags, rather than extracted from the existing slot in the adapter:

```ts
public onStateFlagsChange(flags: Flag[]): void {
  this._flagAdapter.setSlotFlags('states', flags, true);
  this.states.setValue(flags);
  this.states.markAsDirty();
  this.states.updateValueAndValidity();
}
```

(8) in your component's template, the flags component is used like:

```html
<cadmus-ui-flags-picker
  [flags]="stateFlags$ | async"
  (flagsChange)="onStateFlagsChange($event)"
></cadmus-ui-flags-picker>
```
