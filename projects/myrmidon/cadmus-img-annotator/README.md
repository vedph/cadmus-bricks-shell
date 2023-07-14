# CadmusImgAnnotator

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.0.

## Requirements

This library uses [Annotorius](https://annotorious.github.io). The consumer app must install it as follows:

(1) `npm install @recogito/annotorious`;

(2) if you want selectors other than the default rect/polygon, you must also install the [selector pack plugin](https://github.com/recogito/annotorious-selector-pack): `npm i @recogito/annotorious-selector-pack`.

(3) in `angular.json`, add CSS to styles:

```json
"styles": [
  "node_modules/@recogito/annotorious/dist/annotorious.min.css",
  "src/styles.css"
],
```

(4) in your `src` root folder, add a `types.d.ts` file with this declaration:

```ts
declare module "@recogito/annotorious";
```

You can now import and use like this:

```ts
import { Component } from '@angular/core';
// @ts-ignore
import { Annotorious } from '@recogito/annotorious';
// @ts-ignore
import SelectorPack from '@recogito/annotorious-selector-pack';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  ngAfterViewInit(): void {
    // the DOM must be initialized before creating instance
    const cfg = this.config || {};
    cfg.image = this._elementRef.nativeElement;
    this._ann = new Annotorious(cfg);

    // plugin
    if (this.additionalTools?.length) {
      SelectorPack(this._ann, {
        tools: this.additionalTools,
      });
    }
  }
}
```

## Overview

- `ImgAnnotatorDirective` is the lowest level component, in charge of communicating with an Annotorious `annotator`. To use it, just add `cadmusImgAnnotator` as an attribute to your `img` element.
  - ➡️ input:
    - `config: AnnotoriousConfig | undefined`
    - `disableEditor: boolean | undefined`
    - `tool: string`
    - `annotations: any[]`
    - `selectedAnnotation: any | undefined`
    - `additionalTools: string[] | undefined`
  - ⬅️  output:
    - `annotatorInit: any`
    - `cancelSelected: Annotation`
    - `changeSelectionTarget: any`
    - `clickAnnotation: AnnotationEvent`
    - `createAnnotation: AnnotationEvent`
    - `createSelection: Annotation`
    - `deleteAnnotation: AnnotationEvent`
    - `mouseEnterAnnotation: AnnotationEvent`
    - `mouseLeaveAnnotation: AnnotationEvent`
    - `selectAnnotation: Annotation`
    - `updateAnnotation: AnnotationEvent`

- `ImgAnnotatorToolbar` is a dumb component used to provide a toolbar for selecting the drawing tool when using `ImgAnnotatorDirective`.
- ➡️ input:
  - tools: list of tools, each with its Annotorious ID, icon, and tip. Usually you won't set this but just use the default.
- ⬅️  output:
  - `toolChange`: emitted when the control is initialized, and whenever the tool is changed.

>Toolbar consumers just handle the `toolChange` event to set a `tool` property; the annotator directive's `tool` property is bound to it.

- `ImgAnnotationList<T>` (where `T` is the annotation payload type) is a list of image annotations. This list empowers an image annotations list component by maintaining a list of annotation/payload pairs for each annotation, where the payload type is defined by `T`. This list requires an instance of Annotorious `annotator`, and the type of the editor component to use for editing each annotation. It will then use the annotator to keep in synch with Annotorious, and a dialog wrapper to edit each annotation via the provided editor. Consumers should thus provide an annotation editor and a corresponding dialog component wrapper, which wires the annotation to the editor.

- `ImgAnnotationListComponent<T>` (where `T` is the annotation payload type) is a base class for image annotations list components. Derive your component from this, wiring its input `annotator` and `editorComponent` properties. Once both these are set, the list is initialized and ready to be used.
  - ➡️ input:
    - `annotator: any`
    - `editorComponent: any`
    - `annotationToString: (object: ListAnnotation<any>) => string | null`
  - ⬅️ output:
    - `listInit: ImgAnnotationList<T>`: emitted when the list is initialized, which happens as soon as both `annotator` and `editorComponent` are set.

This component takes care of creating the inner list core (of type `ImgAnnotationList<T>`), lazily instantiated by this base class as soon as all its dependencies are satisfied (via bound input properties).

## Usage

The typical usage of these components is represented by a customized component which has:

- an **annotator directive**, properly configured via bound properties, and emitting a number of events for initialization (which provides the `annotator` instance) and user interaction.
- a customized **list component** (derived from `ImgAnnotationListComponent<T>`) which provides the list of annotations with their payloads synched with Annotorious, and allows editing each in its own editor wrapped in a popup dialog. So, this component requires:
  - a component to edit the annotation and its payload;
  - a dialog component wrapping this editor component so that it can popup as a dialog.

As the annotator directive emits events and the list consumes most of them, this component orchestrates their interaction by handling the annotator events via calls to the inner list core of the list component.

Also, this component must provide the annotation editor type, which is bound to the list component.
