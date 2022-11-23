# Cadmus UI Notes Set

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.0.0.

A fixed set of editable notes, using plain text and/or Markdown.

## Requirements

This requires [ngx-markdown](https://github.com/jfcere/ngx-markdown):

```bash
npm install ngx-markdown marked --save
npm install @types/marked --save-dev
```

As the library is using Marked parser you will need to add `node_modules/marked/marked.min.js` to your application. If you are using Angular CLI you can add to `scripts`:

```json
"scripts": [
 "node_modules/marked/marked.min.js"
]
```

Also ensure to import `MarkdownModule.forRoot()` in your app module, as `forRoot` injects the required `MarkdownService`.
