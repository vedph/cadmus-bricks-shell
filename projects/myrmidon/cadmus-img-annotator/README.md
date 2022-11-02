# CadmusImgAnnotator

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.0.

## Requirements

This library uses Annotorius. The consumer app must install it as follows:

(1) `npm install @recogito/annotorious`
(2) in `angular.json`, add CSS to styles:

```json
"styles": [
  "node_modules/@recogito/annotorious/dist/annotorious.min.css",
  "src/styles.css"
],
```

(3) in your `src` root folder, add a `types.d.ts` file with this declaration:

```ts
declare module "@recogito/annotorious";
```

You can now import and use like this:

```ts
import { Component } from '@angular/core';
import { Annotorious } from '@recogito/annotorious';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'annotest';

  constructor() {}

  ngAfterViewInit(): void {
    // the DOM must be initialized before creating instance
    const anno = new Annotorious({
      image: document.getElementById('my-image'),
    });
  }
}
```
