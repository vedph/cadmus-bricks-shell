# CadmusUiFlagsPicker

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.0.

The flags picker allows to select 1 or more flags (i.e. entries which are either present or absent) from a list. Each flag has a string ID and a human-friendly label, and implements interface `Flag`. Optionally users can add new flags to the list.

## API

Each flag has:

- `id`: the ID for this flag.
- `label`: the human-friendly label for this flag.
- `user`: optionally set to true when this flag was added by user.

Component's properties:

- `selectedIds`: array of selected flag IDs.
- `flags`: the list of flags available for selection.
- `numbering`: true to show an ordinal number next to each flag.
- `toolbar`: true to show the toolbar including quick selection buttons and the UI for adding new flags.
- `allowUserFlags`: true to allow users add new flags.

Component's events:

- `selectedIdsChange`: emitted when selection changes.
- `flagsChange`: emitted when flags have changed.
