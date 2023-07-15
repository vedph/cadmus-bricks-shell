# Cadmus Bricks Shell

- [Cadmus Bricks Shell](#cadmus-bricks-shell)
  - [Adding a Brick](#adding-a-brick)
  - [History](#history)
    - [1.0.16](#1016)
    - [1.0.15](#1015)
    - [1.0.14](#1014)
    - [1.0.13](#1013)
    - [1.0.12](#1012)
    - [1.0.11](#1011)
    - [1.0.10](#1010)
    - [1.0.9](#109)
    - [1.0.8](#108)
    - [1.0.7](#107)
    - [1.0.6](#106)
    - [1.0.5](#105)
    - [1.0.4](#104)
    - [1.0.3](#103)
    - [1.0.2](#102)
    - [1.0.1](#101)
    - [1.0.0](#100)
    - [0.1.3](#013)
    - [0.1.2](#012)
    - [0.1.1](#011)
    - [0.1.0](#010)
    - [0.0.8](#008)
    - [0.0.7](#007)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.0.4.

👀 [Bricks Demo](https://cadmus-bricks.fusi-soft.com): an online demo showing all the bricks in action. Just pick the desired one from the menu and play with it.

This project is a shell for incubating a number of Cadmus sub-models, implemented as Angular components with their editing UI.

As Cadmus projects increase, the prototype code reveals more and more portions which can be developed as shared, reused UI components: these are the bricks, i.e. sub-model editor components shared by many projects. Each brick or set of bricks is grouped in a single library, which can be imported in your Cadmus frontend project.

>⚠️ Note that some of the bricks require additional third-party libraries. See the documentation about each library for details.

🐋 Quick **Docker image** build (the only purpose of this image is letting testers play with controls in the incubator):

1. `npm run build-lib`.
2. ensure to update the version in `env.js` (and `docker-compose.yml`), and `ng build --configuration production`.
3. `docker build . -t vedph2020/cadmus-bricks-app:1.0.16 -t vedph2020/cadmus-bricks-app:latest` (replace with the current version).

Use [publish.bat](publish.bat) to publish the libraries to NPM.

📖 More info about some bricks:

- [asserted IDs](./projects/myrmidon/cadmus-refs-asserted-ids/README.md)
- [codicologic location](./projects/myrmidon/cadmus-cod-location/README.md)
- [flags picker](./projects/myrmidon/cadmus-ui-flags-picker/README.md)
- [image annotations](./projects/myrmidon/cadmus-img-gallery/README.md)
- [proper name](./projects/myrmidon/cadmus-refs-proper-name/README.md)
- [reference lookup](./projects/myrmidon/cadmus-refs-lookup/README.md)
- [text block view](./projects/myrmidon/cadmus-text-block-view/README.md)

## Adding a Brick

To add a brick:

1. add a library project to this workspace: `ng g library @myrmidon/LIBNS-LIBNAME --prefix cadmus-LIBNS`.
2. add a control in the library.
3. add a corresponding host page in the app, with its menu and route.

## History

- 2023-07-14: BREAKING CHANGES in image annotation, switching to Annotorious headless mode. Migration is only partially completed. Affected library versions bumped to version 3.

### 1.0.16

- 2023-07-10:
  - updated Angular.
  - minor refactorings in main menu.
  - added optional placeholders `.before-list` and `.after-list` to `cadmus-img-gallery`.
- 2023-07-06:
  - in pin target lookup component, fix to label validator required when not external.
  - added `defaultPartTypeKey` property to provide a default part type key for target lookup when by type is active.
  - when calling `getPartFromTypeAndRole` and `getItem` for lookup, avoid error on 404. This avoids disrupting the code execution when there is no metadata part for a target item.

### 1.0.15

- 2023-07-05: updated Angular.
- 2023-06-21: added default units to physical size. You can now specify a default unit different from `cm` (which remains the default when no such properties are set) via `defaultWUnit`, `defaultHUnit`, `defaultDUnit`.
- 2023-06-13: added `GalleryOptionsService` to allow changing gallery options.
- 2023-05-25: fixes to pin target lookup.
- 2023-05-22: added asserted composite ID editors and pin target lookup component (`@myrmidon/cadmus-refs-asserted-ids`, version 2.1.0).
- 2023-05-11: updated to Angular 16.
- 2023-04-15: added custom actions to image gallery.
- 2023-04-14:
  - added custom actions bar.
  - updated Angular.
- 2023-04-02: fixed bug with proper name editing.

### 1.0.14

- 2023-03-26: added more Annotorious selectors using the [selector pack plugin](https://github.com/recogito/annotorious-selector-pack): `npm i @recogito/annotorious-selector-pack`.
- 2023-03-24: added `skip` and `limit` to IIIF service options.
- 2023-03-23:
  - added OSD image gallery library.
  - moved join pipe to `NgToolsModule`.

### 1.0.13

- 2023-03-22: added simple IIIF gallery service.

### 1.0.12

- 2023-03-15: fixes to OSD annotator.
- 2023-03-11: updated packages.

### 1.0.11

- 2023-03-02: more notes per annotation.

### 1.0.10

- 2023-03-02: fixes to annotator.

### 1.0.9

- 2023-03-01: clear annotations when switching image.

### 1.0.8

- 2023-03-01: fixes.
- 2023-02-28:
  - adding image gallery.
  - more details in `@myrmidon/cadmus-img-annotator` TS model.
- 2023-02-26: added chronotope and asserted chronotope pipes (`@myrmidon/refs-asserted-chronotope`, `@myrmidon/cadmus-refs-chronotope`).
- 2023-02-11: added `noAssertion` option to proper name editor.
- 2023-02-10: improvements for flags picker.
- 2023-02-09:
  - fix to flags picker custom flag.
  - refactored flags picker.
- 2023-02-08: allow `null` for bound properties with `undefined`.

### 1.0.7

- 2023-02-07:
  - fix to asserted chronotope assertions binding.
  - check not only for undefined but also for null in codicologic location text rendering.
- 2023-02-06: fix to proper name binding.
- 2023-02-03: fixes to thesauri bindings.

### 1.0.6

- 2023-02-03:
  - allow null in `PhysicalSizeComponent`.
  - refactored input properties binding so that there is no need for using a different variable for the initial value in most components. An input value triggers form update, which should happen only if the bound object has changed. Also, the output event should update the bound object before emitting, so that the parent handling that events and setting the bound property to the new value will not trigger an infinite loop. Guidelines:
    - in the input property ensure to check for reference equality, and update form only if different.
    - in updating form, no change event is emitted.
    - in the output event, assign new value to the inner model before emitting the change event.
- 2023-01-30:
  - `PinRefLookupService`: use "contains" rather than "starts-with" operator in query.
  - updated Angular.
- 2023-01-24:
  - auto-close scoped pin lookup picker on pick.
  - fix location to string for closing brackets.

### 1.0.5

- 2023-01-23: added covers to codicologic location.

### 1.0.4

- 2023-01-20:
  - added missing close functionality in asserted ID editor.
  - added pin to available metadata in asserted ID builder.

### 1.0.3

- 2023-01-19:
  - `cod-location`: `n` is no more required and defaults to 0. This allows dealing with non-physical (label-driven) locations.
  - updated Angular and packages.
  - added internal lookup capability to asserted IDs.
- 2023-01-18: added missing label to physical size h-unit.
- 2023-01-03:
  - ensure that input properties check for reference equality in setter.
  - added proper name service.

### 1.0.2

- 2022-12-30: refactored [proper names](./projects/myrmidon/cadmus-refs-proper-name/README.md) editor. The model has not changed, but the editor and its thesauri have been refactored so that they can represent also hierarchically structured appellations, especially useful for place names (`@myrmidon/cadmus-refs-proper-name`).
- 2022-12-19:
  - fix to note style in assertion (`@myrmidon/cadmus-refs-assertion`).
  - updated Angular.

### 1.0.1

- 2022-12-14: fixed tip in `@myrmex/cadmus-cod-location` to include word.
- 2022-12-06: fixed asserted chronotopes set add button does not show editor.
- 2022-12-03:
  - removed `@angular/flex-layout`
  - fixed missing label in cod-location
  - fixed styles for some buttons
- 2022-12-01: fixed button labels in `@myrmidon/cadmus-refs-asserted-ids` and `@myrmidon/cadmus-refs-external-ids`.
- 2022-11-25: replaced `CadmusValidators` with `NgToolsValidators` in `@myrmidon/cadmus-refs-proper-name`.
- 2022-11-23: added `@myrmidon/cadmus-ui-note-set` (from `@myrmidon/cadmus-codicology-ui`).

### 1.0.0

Version 1.0.0 onwards target the new Cadmus shell, which starts from Angular 15.

- 2022-11-22: migrated to Angular 15, adjusting for new Material.
- 2022-11-21: fix to _required_ flag in lookup.

### 0.1.3

- 2022-11-11: added more properties/events to annotator.

### 0.1.2

- 2022-11-02:
  - updated Angular and packages.
  - added image annotator brick (using [recogito Annotorious](https://recogito.github.io/annotorious/) with a thin Angular wrapper).
- 2022-09-15: updated Angular.
- 2022-08-04:
  - honor H before W in physical size pipe and label.
  - updated Angular.

### 0.1.1

- 2022-08-03: added `@myrmidon/cadmus-refs-asserted-ids` library and moved the old `@myrmidon/cadmus-refs-asserted-id` into it. Thus, now library `@myrmidon/cadmus-refs-asserted-id` is deprecated, and should be replaced by `@myrmidon/cadmus-refs-asserted-ids`, which includes the same component plus another one for editing multiple IDs at once. Also, this should also deprecate `@myrmidon/cadmus-refs-external-ids`, which refers to a legacy model where the external ID had a rank, and then got an assertion later. It is recommended to prefer the new `AssertedId` based model and consider `ExternalId` as deprecated. In bricks backend, these are the models:

```txt
ExternalId
 - Tag
 - Value
 - Scope

AssertedId : ExternalId
  - Assertion

RankedExternalId (deprecated) : ExternalId
  - Rank

Assertion
  - Tag
  - Rank
  - References
  - Note

DocReference
  - Type
  - Tag
  - Citation
  - Note
```

- 2022-08-02: added thesaurus to decorated counts IDs.
- 2022-08-01: updated Angular.
- 2022-07-18: added `hBeforeW` property to physical size.
- 2022-07-14: upgraded Angular.
- 2022-07-10: upgraded Angular.

### 0.1.0

- 2022-06-10: upgraded to Angular 14.
- 2022-05-13: upgraded Angular.
- 2022-04-01: fire IDs change on init in flags picker.

### 0.0.8

- 2022-03-25: fix validation check in lookup.
- 2022-03-23: fixes to decorated counts.
- 2022-03-22: added `baseFilter` to lookup.
- 2022-03-15: cod location: properly react to single/required changes.
- 2022-03-14: better lookup UI.
- 2022-03-10: upgraded Angular to 13.2.6.

### 0.0.7

- 2022-02-13: upgraded Angular.
- 2022-02-05: added user-defined flags to flags picker.
- 2022-02-03: Docker image 0.0.7.
- 2022-01-30: minor fixes to asserted chronotopes set.
- 2022-01-29: added decorated counts library. Docker image 0.0.6.
- 2022-01-26: added `AssertedChronotopeSet` editor. Docker image 0.0.5.
- 2022-01-23: added pipes for `CodLocation`, `CodLocationRange`, and `PhysicalSize`.
- 2022-01-16: fixed model of `AssertedChronotope`.
- 2022-01-13: block id as div id in `CadmusTextBlockView`. Upgraded Angular. Docker image 0.0.4.
- 2022-01-11: style customization for `CadmusTextBlockView`.
- 2022-01-09: added assertion to external IDs and proper name.
- 2022-01-06: added `word` to `CodLocation`.
- 2022-01-05: added `HistoricalDatePipe` and updated dependencies from Cadmus core.
- 2021-12-24: refactored chronotopes, Docker image 0.0.3.
- 2021-12-22: Docker image 0.0.2.
- 2021-12-20: added physical size. This was taken from Cadmus UI, so this will be refactored later.
- 2021-12-15: removed dependencies from `@myrmidon/cadmus-material` and bumped all version numbers accordingly.
- 2021-12-13: added link button to ref-lookup component.
- 2021-12-11: updated lib dependencies to 13.1.0, improved doc references visuals.
- 2021-12-10: upgraded Angular and refactored historical date editor implementation by replacing legacy code.
