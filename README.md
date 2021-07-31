# Cadmus Bricks Shell

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.0.4.

This project is a shell for incubating a number of Cadmus sub-models, implemented as Angular components with their editing UI.

As Cadmus projects increase, the prototype code needs to be chopped into smaller portions, so that they can be easily reused with minimal overhead. Yet, we need a smooth migration because most Cadmus projects are in a production stage, nor I have time to refactor everything at once.

The upgrade strategy is thus starting with the creation of "bricks", i.e. the sub-model components shared by many projects. Each of these bricks should be wrapped in its own module. So, in the end we will have a library project for each brick.

To better organize the library projects, I adopt a namespace-like naming convention: all the libraries start with `cadmus-` followed by a namespace roughly representing its conceptual domain. For instance, we start with `PersonName`, which belongs to the prosopographic components; its library is thus named `cadmus-prosopa-person-name`. Any other component belonging to the same domain will add the `cadmus-prosopa-` prefix to the name of the component it contains.

At this stage, the bricks themselves depend on more monolithic Cadmus libraries, like the Cadmus core. In future these will be split; but at this time, we just depend on them, so that nothing gets broken in the dependencies chain, and new projects can leverage the new bricks while still using the traditional dependencies.

## Roadmap

The roadmap for bricks is as follows:

- whenever a general purpose brick is required, it gets added as a library to this shell.
- new projects import and use its library.
- old projects are usually unaffected, unless the components promoted to bricks come from their context. In this case, when there is time they get removed from the original context and the corresponding brick is imported there instead.
- when time allows it, old projects can be refactored so that they can take advantage of bricks instead of their monolithic dependencies.

In the end, the ideal target is having a lot of small libraries working together, each with minimal dependencies.

## Adding a Brick

To add a brick:

1. add a library project to this workspace: `ng g library @myrmidon/LIBNS-LIBNAME --prefix cadmus-LIBNS`.

2. add a control in the library.

3. add a corresponding host page in the app, with its menu and route.

## Publishing

1. update the library version numbers
2. `npm run build-refs`
3. `npm run build-prosopa`
4. `./publish`
