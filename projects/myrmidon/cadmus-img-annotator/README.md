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
