# Cadmus Bricks Shell

- [Cadmus Bricks Shell](#cadmus-bricks-shell)
  - [Adding a Brick](#adding-a-brick)
  - [History](#history)
    - [1.0.0](#100)
    - [0.1.3](#013)
    - [0.1.2](#012)
    - [0.1.1](#011)
    - [0.1.0](#010)
    - [0.0.8](#008)
    - [0.0.7](#007)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.0.4.

👀 [Bricks Demo](https://cadmus-bricks.fusi-soft.com)

This project is a shell for incubating a number of Cadmus sub-models, implemented as Angular components with their editing UI.

As Cadmus projects increase, the prototype code needs to be chopped into smaller portions, so that they can be easily reused with minimal overhead. Yet, we need a smooth migration because most Cadmus projects are in a production stage, nor I have time to refactor everything at once.

The upgrade strategy is thus starting with the creation of "bricks", i.e. the sub-model components shared by many projects. Each of these bricks should be wrapped in its own module. So, in the end we will have a library project for each brick.

At this stage, the bricks themselves depend on more monolithic Cadmus libraries, like the Cadmus core. In future these will be split; but at this time, we just depend on them, so that nothing gets broken in the dependencies chain, and new projects can leverage the new bricks while still using the traditional dependencies.

Quick Docker image build (the only purpose of this image is letting testers play with controls in the incubator):

1. `npm run build-lib`.
2. ensure to update the version in `app.component.html`, and `ng build --configuration production`.
3. `docker build . -t vedph2020/cadmus-bricks-app:0.1.3 -t vedph2020/cadmus-bricks-app:latest` (replace with the current version).

## Adding a Brick

To add a brick:

1. add a library project to this workspace: `ng g library @myrmidon/LIBNS-LIBNAME --prefix cadmus-LIBNS`.
2. add a control in the library.
3. add a corresponding host page in the app, with its menu and route.

## History

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
