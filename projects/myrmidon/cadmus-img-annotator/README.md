# Cadmus Image Annotator Library

Since its version 3, this library has been refactored to use Annotorious _headless mode_. In this mode, the Annotorious library is used only for drawing, while disposing of its default popup UI. This allows for much more customization, even if at a price of higher code complexity.

- [Cadmus Image Annotator Library](#cadmus-image-annotator-library)
  - [Requirements](#requirements)
  - [Overview](#overview)
  - [Usage](#usage)
    - [Annotated Image](#annotated-image)
    - [Annotated Image with Gallery](#annotated-image-with-gallery)
      - [1. Modeling Annotation](#1-modeling-annotation)
      - [2. Creating Gallery Components](#2-creating-gallery-components)
      - [3. Creating Gallery](#3-creating-gallery)

## Requirements

- [Annotorious API](https://annotorious.github.io/api-docs/annotorious)
- [Annotorious Plugins](https://annotorious.github.io/plugins)
- [Annotorious Selector Pack](https://github.com/annotorious/annotorious-v2-selector-pack)
- [Formatters](https://observablehq.com/@rsimon/writing-annotorious-formatters-pt-1): this explains low-level coding, but a label formatter is available among plugins.

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

This library contains the following components:

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

### Annotated Image

The typical usage of these components is represented by a customized component which has:

- an **annotator directive**, properly configured via bound properties, and emitting a number of events for initialization (which provides the `annotator` instance) and user interaction.
- a customized **list component** (derived from `ImgAnnotationListComponent<T>`) which provides the list of annotations with their payloads synched with Annotorious, and allows editing each in its own editor wrapped in a popup dialog. So, this component requires:
  - a component to edit the annotation and its payload;
  - a dialog component wrapping this editor component so that it can popup as a dialog.

As the annotator directive emits events and the list consumes most of them, this component orchestrates their interaction by handling the annotator events via calls to the inner list core of the list component.

Also, this component must provide the annotation editor type, which is bound to the list component.

You can find an example of this in this app's image gallery page (`img-gallery-pg.component`).

### Annotated Image with Gallery

A more complex scenario involves the usage of an images gallery, which allows users to pick images from a list, whatever its source (typically, but not limited to, IIIF).

To build such a gallery, you can follow the steps outlined here.

#### 1. Modeling Annotation

First, define the model of your annotation. This should be done both at the backend and at the frontend level. The essential model from Annotorious is here represented by `Annotation`:

- `id`: a GUID prefixed by `#`
- `value`:
  - `@context` (`http://www.w3.org/ns/anno.jsonld`)
  - `type` (`Annotation`)
  - `body`: an array including objects having:
    - `type` (`TextualBody`)
    - `value` (the text entered by user)
    - `purpose` (`commenting` or `tagging`)
  - `target`:
    - `source`: image URI
    - `selector`
      - `type` (`FragmentSelector`)
      - `conformsTo` (`http://www.w3.org/TR/media-frags/`)
      - `value` (e.g. `xywh=pixel:42,32,127,200`)

Here, annotations are included in lists, and wrap custom payload data; their type is `ListAnnotation<T>`. This type pairs an Annotorious `Annotation` with a custom payload:

- `id`: the ID as derived from Annotorious.
- `image`: the image (`GalleryImage`) being annotated.
- `value` (`Annotation`): the Annotorious annotation.
- `payload`: this is up to you.

#### 2. Creating Gallery Components

A gallery implies an image, picked from a list; and a set of annotations on it. A gallery image is any object implementing the `GalleryImage`, which provides the barely minimum properties of each image: a string ID, a URI, a title, and a short description.

A **gallery component** is designed to get a _gallery image_ and optionally a set of _list annotations_ to edit; and interactively emit as output a _gallery annotated image_ (`GalleryAnnotatedImage<T>`), which pairs a `GalleryImage` with its list annotations.

This component requires:

(2A) an **editor component** to edit list annotations. These components mostly edit the payload portion of the annotation, and of course vary according to the payload used. This is a dumb component which gets an annotation and emits its change event.

A template for its body can be:

```ts
private _annotation?: ListAnnotation<any>;

@Input()
public get annotation(): ListAnnotation<any> | undefined {
  return this._annotation;
}
public set annotation(value: ListAnnotation<any> | undefined) {
  if (this._annotation === value) {
    return;
  }
  this._annotation = value;
  this.updateForm(this._annotation);
}

@Output()
public cancel: EventEmitter<any>;

@Output()
public annotationChange: EventEmitter<ListAnnotation<any>>;

private getAnnotation(): ListAnnotation<any> {
  // TODO get annotation from form
}

public close(): void {
  this.cancel.emit();
}

public save(): void {
  if (this.form.invalid) {
    return;
  }
  this._annotation = this.getAnnotation();
  this.annotationChange.emit(this.annotation);
}
```

with its template:

```html
<fieldset>
  <legend>annotation</legend>
  <form [formGroup]="form" (submit)="save()">
    TODO your form controls here...
    <div class="center-content">
      <button type="button" mat-icon-button (click)="close()" color="warn">
        <mat-icon>cancel</mat-icon>
      </button>
      <button
        type="submit"
        mat-icon-button
        color="primary"
        [disabled]="form.pristine || form.invalid"
      >
        <mat-icon>check_circle</mat-icon>
      </button>
    </div>
  </form>
</fieldset>
```

and styles:

```css
fieldset {
  border: 1px solid silver;
  border-radius: 4px;
  padding: 6px;
}
legend {
  color: silver;
}
.center-content {
  display: flex;
  justify-content: center;
}
```

You can find an example of this component in this demo app at `edit-annotation-component`. This is a simple editor which has no payload at all and just deals with a single text annotation added to the annotation body. In real world, you would have your own payload or at least more annotations (comments and/or tags) like in the default Annotorious UI.

(2B) a **dialog wrapper** for this editor. This is used to wire the list annotation received by the editor to the bindings in your editor, providing a frame to be used as a popup dialog whose content is determined by the editor.

For instance, here is a wrapper using an any-type payload for the demo editor (which has no payload at all):

```ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import {
  Annotation,
  ListAnnotation,
} from 'projects/myrmidon/cadmus-img-annotator/src/public-api';

/**
 * A dialog wrapping an annotation editor. This just wires the received
 * data with the editor.
 */
@Component({
  selector: 'app-edit-annotation-dialog',
  templateUrl: './edit-annotation-dialog.component.html',
  styleUrls: ['./edit-annotation-dialog.component.css'],
})
export class EditAnnotationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EditAnnotationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ListAnnotation<any>
  ) {}

  onCloseClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(annotation: ListAnnotation<any>): void {
    this.dialogRef.close(annotation);
  }
}
```

and its template:

```html
<h1 mat-dialog-title>Edit Annotation</h1>
<div mat-dialog-content>
  <!-- this is your own list annotation editor -->
  <app-edit-annotation
    [annotation]="data"
    (cancel)="onCloseClick()"
    (annotationChange)="onSaveClick($event)"
  ></app-edit-annotation>
</div>
```

(2C) a customized version of an **annotations list component**, derived from `ImgAnnotationListComponent<T>`. Typically all what you have to do is implement a few methods for user actions, and use the type argument corresponding to your payload (in this sample we just have `any` because it is related to the app's sample with no payload).

```ts
import { Component } from '@angular/core';
import { ImgAnnotationListComponent } from 'projects/myrmidon/cadmus-img-annotator/src/public-api';

@Component({
  selector: 'app-my-img-annotation-list',
  templateUrl: './my-img-annotation-list.component.html',
  styleUrls: ['./my-img-annotation-list.component.css'],
})
export class MyImgAnnotationListComponent extends ImgAnnotationListComponent<any> {
  public selectAnnotation(annotation: any): void {
    this.list?.selectAnnotation(annotation);
  }

  public removeAnnotation(index: number): void {
    this.list?.removeAnnotation(index);
  }

  public editAnnotation(annotation: any): void {
    this.list?.editAnnotation(annotation);
  }
}
```

Its template should represent the list of annotations, so here you are free to implement the design you prefer. For instance, here is a table:

```html
<div *ngIf="list">
  <table *ngIf="list!.annotations$ | async as annotations">
    <thead>
      <tr>
        <th></th>
        <th>annotation</th>
        <th class="noif-lt-md">ID</th>
      </tr>
    </thead>
    <tbody>
      <tr
        *ngFor="let a of annotations; let i = index"
        [class.selected]="a === (list!.selectedAnnotation$ | async)"
      >
        <td class="fit-width">
          <button
            type="button"
            mat-icon-button
            (click)="selectAnnotation(i)"
            matTooltip="Select annotation"
          >
            <mat-icon>check_circle</mat-icon>
          </button>
          <button
            type="button"
            mat-icon-button
            color="warn"
            (click)="removeAnnotation(i)"
            matTooltip="Remove annotation"
          >
            <mat-icon>delete</mat-icon>
          </button>
          <button
            type="button"
            mat-icon-button
            color="primary"
            (click)="editAnnotation(i)"
            matTooltip="Edit annotation"
          >
            <mat-icon>edit</mat-icon>
          </button>
        </td>
        <td>{{ a | objectToString : annotationToString }}</td>
        <td class="muted noif-lt-md">{{ a.id }}</td>
      </tr>
    </tbody>
  </table>
</div>
```

with its styles:

```css
table {
  width: 100%;
  border-collapse: collapse;
}
.muted {
  color: silver;
}
tr:nth-child(odd) {
  background-color: #fafafa;
}
th {
  font-weight: normal;
  color: silver;
  text-align: left;
}
tr.selected {
  border: 1px solid orange;
}
td.fit-width {
  width: 1px;
  white-space: nowrap;
}
@media only screen and (max-width: 959px) {
  .noif-lt-md {
    display: none;
  }
}
```

#### 3. Creating Gallery

Finally, you must create a gallery component to orchestrate all these components:

- an **image** decorated with the annotator directive and linked to an annotator tools bar for selecting the drawing tool. The directive is bound to the selected image, and its events are handled by the parent component.

- a **list of annotations**, represented by your annotations list component (see above, 2C). This is bound to the annotator instance, got from the annotator directive; and to the annotation editor type, provided by a property in the parent component; its event provides the list instance which manages data.

- a **gallery list**, which provides the list of images to pick from; the parent component handles the image pick event.

Here is a sample code:

```ts
@Component({
  selector: 'app-my-gallery-image-annotator',
  templateUrl: './my-gallery-image-annotator.component.html',
  styleUrls: ['./my-gallery-image-annotator.component.css'],
})
export class MyGalleryImageAnnotatorComponent implements OnInit, OnDestroy {
  private _sub?: Subscription;
  private _image?: GalleryImage;
  private _list?: ImgAnnotationList<MyAnnotationPayload>;

  public entries: ThesaurusEntry[];
  public annotator?: any;
  public editorComponent = EditAnnotationDialogComponent;
  public tool: string = 'rect';
  public tabIndex: number = 0;
 
  /**
   * The gallery image to annotate.
   */
  @Input()
  public get image(): GalleryImage | undefined | null {
    return this._image;
  }
  public set image(value: GalleryImage | undefined | null) {
    if (this._image === value) {
      return;
    }
    this._image = value || undefined;
    // reset annotations if image URI changed
    if (this._image?.uri !== value?.uri) {
      this._list?.clearAnnotations();
    }
    // switch to image tab
    setTimeout(() => {
      this.tabIndex = value ? 0 : 1;
    });
  }

  /**
   * The annotations being edited.
   */
  @Input()
  public get annotations(): ListAnnotation<MyAnnotationPayload>[] {
    return this._list?.getAnnotations() || [];
  }
  public set annotations(value: ListAnnotation<MyAnnotationPayload>[]) {
    this._list?.setAnnotations(value);
  }

  /**
   * Emitted whenever annotations change.
   */
  @Output()
  public annotationsChange: EventEmitter<
    GalleryAnnotatedImage<MyAnnotationPayload>
  >;

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DEFAULT_OPTIONS) public dlgConfig: MatDialogConfig,
    @Inject(IMAGE_GALLERY_SERVICE_KEY)
    private _galleryService: GalleryService,
    private _options: GalleryOptionsService,
    formBuilder: FormBuilder
  ) {
    this.annotationsChange = new EventEmitter<
      GalleryAnnotatedImage<MyAnnotationPayload>
    >();

    // mock filter entries
    this.entries = [
      {
        id: 'title',
        value: 'title',
      },
      {
        id: 'dsc',
        value: 'description',
      },
    ];
  }

  public ngOnInit(): void {
    if (!this._image) {
      this.tabIndex = 1;
    }
  }

  public ngOnDestroy(): void {
    this._sub?.unsubscribe();
  }

  public onToolChange(tool: string): void {
    this.tool = tool;
  }

  public onAnnotatorInit(annotator: any) {
    setTimeout(() => {
      this.annotator = annotator;
    });
  }

  public onListInit(list: ImgAnnotationList<MyAnnotationPayload>) {
    this._list = list;

    // emit annotations whenever they change
    this._sub?.unsubscribe();
    this._sub = this._list.annotations$.subscribe((annotations) => {
      if (this._image) {
        this.annotationsChange.emit({
          image: this._image,
          annotations: annotations,
        });
      }
    });
  }

  public setAnnotations(): void {
    if (this.form.invalid) {
      return;
    }
    const annotations = JSON.parse(this.json.value || '[]');
    this._list?.setAnnotations(annotations);
  }

  public onCreateSelection(annotation: Annotation) {
    this._list?.onCreateSelection(annotation);
  }

  public onSelectAnnotation(annotation: Annotation) {
    this._list?.onSelectAnnotation(annotation);
  }

  public onCancelSelected(annotation: Annotation) {
    this._list?.onCancelSelected(annotation);
  }

  public editAnnotation(index: number): void {
    this._list?.editAnnotation(index);
  }

  public selectAnnotation(index: number): void {
    this._list?.selectAnnotation(index);
  }

  public removeAnnotation(index: number): void {
    this._list?.removeAnnotation(index);
  }

  public onCreateAnnotation(event: AnnotationEvent) {
    this._list?.onCreateAnnotation(event);
  }

  public onUpdateAnnotation(event: AnnotationEvent) {
    this._list?.onUpdateAnnotation(event);
  }

  public onDeleteAnnotation(event: AnnotationEvent) {
    this._list?.onDeleteAnnotation(event);
  }

  public onImagePick(image: GalleryImage): void {
    this._galleryService
      .getImage(image.id, this._options.get())
      .pipe(take(1))
      .subscribe((image) => {
        this.image = image!;
      });
    this.tabIndex = 1;
  }
}
```

and its template:

```html
<mat-tab-group [(selectedIndex)]="tabIndex">
  <mat-tab label="Annotator">
    <div id="container">
      <div id="image" *ngIf="image">
        <div>
          <cadmus-img-annotator-toolbar
            (toolChange)="onToolChange($event)"
          ></cadmus-img-annotator-toolbar>
        </div>
        <div>
          <img
            alt="image"
            cadmusImgAnnotator
            (createAnnotation)="onCreateAnnotation($event)"
            (updateAnnotation)="onUpdateAnnotation($event)"
            (deleteAnnotation)="onDeleteAnnotation($event)"
            (createSelection)="onCreateSelection($event)"
            (selectAnnotation)="onSelectAnnotation($event)"
            (cancelSelected)="onCancelSelected($event)"
            (annotatorInit)="onAnnotatorInit($event)"
            [disableEditor]="true"
            [tool]="tool"
            [additionalTools]="['circle', 'ellipse', 'freehand']"
            [src]="image!.uri"
          />
        </div>
      </div>
      <div id="list">
        <app-my-img-annotation-list
          [image]="image!"
          [annotator]="annotator"
          [editorComponent]="editorComponent"
          (listInit)="onListInit($event)"
        ></app-my-img-annotation-list>
      </div>
    </div>
  </mat-tab>
  <mat-tab label="Gallery">
    <cadmus-gallery-list
      [entries]="entries"
      (imagePick)="onImagePick($event)"
    ></cadmus-gallery-list>
  </mat-tab>
</mat-tab-group>
```

with styles:

```css
div#container {
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: auto minmax(0, 1fr);
  grid-template-areas: "image list";
  gap: 8px;
}
div#image {
  grid-area: image;
}
div#list {
  grid-area: list;
}
@media only screen and (max-width: 959px) {
  div#container {
    grid-template-columns: 1fr;
    grid-template-areas:
      "image"
      "list";
  }
}
```
