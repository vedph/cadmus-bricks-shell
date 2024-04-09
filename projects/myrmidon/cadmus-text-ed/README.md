# Cadmus Text Editor Helpers

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.0. It contains helper components for basic inline annotations on a text.

## Text Editing Service

The typical scenario is a Monaco-based editor, usually with Markdown text, where users require some assistance in adding inline annotations. Assistance ranges from trivial shortcut operations, like toggling bold or italic in Markdown, to more complex scenarios, where for instance you might want to add a hyperlink targeting an external or internal resource.

In these cases, you might imagine an editor where users type Markdown, and use shortcuts like CTRL+B for toggling bold (rather than manually typing or removing double asterisks), CTRL+I for italic (rather than manually typing or removing single asterisks), and CTRL+L for adding links.

When adding links, you might open a popup dialog with a lookup component like an asserted composite ID picker, so that when the user picks an entity a Markdown link is automatically created or updated with its identifier.

This is most useful in cases where you have free text comments with some hyperlinks to resources inside or outside the Cadmus database.

To ease the implementation of this scenario, the library provides service `CadmusTextEdService`. This is a simple host for plugins, which are used to edit the received text in some way.

Each plugin is a function that takes a text and an optional context object, and returns a promise with a result. For instance, there are stock plugins for toggling bold or italic in Markdown text. The service can be used in inline text editing, typically in Monaco-based editors with Markdown content.

## Text Editing Plugin

A plugin is a class implementing `CadmusTextEdPlugin`. It can be disabled by setting its `enabled` property to false, and besides some readonly metadata its logic requires just two functions, `matches` and `edit`, both receiving an object of type `CadmusTextEdQuery`.

The **query** object has a `selector`, an input `text`, and an optional `context` object of any type. The selector is any of these strings:

- `id`: select the plugin with the specified ID.
- `match-first`: select the first matching plugin.
- `match-all`: select all the matching plugins.

The plugin functions are `matches`, which returns true if the plugin matches, and `edit` which performs the actual edit. This function returns a `Promise<CadmusTextEdPluginResult>`, where the result has these properties:

- `query`: the input query.
- `text`: the edited output text.
- `ids`: an optional array with the IDs of all the plugins that have been applied to the text.
- `payloads`: an optional array with all the payload objects output by the plugin. This array has the same size of ids, so that those plugins which do not return a payload will have an undefined entry here.
- `error`: an optional error message. When this is not falsy, this means that the plugin encountered an error and usually the result is the same as the input text. As soon as an error occurs, the editing process stops and this error is set.

## Using the Service

To use the text editing service in your app, you just have to configure its options (`CadmusTextEdServiceOptions`). Currently, the only property in these options is the list of plugins.

The text editing service is not a singleton, so you can configure each instance of it as you prefer.

To configure plugins **globally** for all the instances you inject, in your app configuration add the desired plugins to `providers` via the specified injection token:

```ts
{
  provide: CADMUS_TEXT_ED_SERVICE_OPTIONS_TOKEN,
  useValue: {
    plugins: [
      // your plugins here...
    ]
  },
}
```

This injection token is optionally injected into the service, so you just have to provide it to configure all the instances of the service in the same way. This way, whenever the service is injected, you will get a separate instance, but configured in the same way.

Alternatively, you can configure plugins **per consumer**. In this case, just inject into your consumer an unconfigured service, without setting the default configuration as explained above. This means that an instance of the service will be injected with no plugins; in this case, you have to add the desired plugins via its `configure` method.

⚠️ As plugins might require dependencies, to allow them be provided by DI you should create them via the [inject function](https://angular.io/api/core/inject) rather than just using `new`.
