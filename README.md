# Cadmus Bricks Shell

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.0.4.

This project is a shell for incubating a number of Cadmus sub-models, implemented as Angular components with their editing UI.

As Cadmus projects increase, the prototype code needs to be chopped into smaller portions, so that they can be easily reused with minimal overhead. Yet, we need a smooth migration because most Cadmus projects are in a production stage, nor I have time to refactor everything at once.

The upgrade strategy is thus starting with the creation of "bricks", i.e. the sub-model components shared by many projects. Each of these bricks should be wrapped in its own module. So, in the end we will have a library project for each brick.

At this stage, the bricks themselves depend on more monolithic Cadmus libraries, like the Cadmus core. In future these will be split; but at this time, we just depend on them, so that nothing gets broken in the dependencies chain, and new projects can leverage the new bricks while still using the traditional dependencies.

Quick Docker image build (the only purpose of this image is letting testers play with controls in the incubator):

1. `npm run build-lib`
2. `ng build --configuration production`
3. `docker build . -t vedph2020/cadmus-bricks-app:0.0.7 -t vedph2020/cadmus-bricks-app:latest` (replace with the current version).

## Adding a Brick

To add a brick:

1. add a library project to this workspace: `ng g library @myrmidon/LIBNS-LIBNAME --prefix cadmus-LIBNS`.
2. add a control in the library.
3. add a corresponding host page in the app, with its menu and route.

## History

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
