# Cadmus Refs - Proper Name

- [Cadmus Refs - Proper Name](#cadmus-refs---proper-name)
  - [Editor](#editor)
  - [Pipe](#pipe)

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.0.

## Editor

A **proper name** is a structured name in some _language_, composed by any types and number of components (_pieces_), with an optional attached _tag_ and _assertion_.

To make a trivial sample, say you want to represent a classical _tria nomina_ pattern, like `Publius Vergilius Maro`; here we have 3 pieces building up a Latin name:

- praenomen = `Publius`
- nomen = `Vergilus`
- cognomen = `Maro`

So, here you would have to provide a thesaurus for the piece types, like:

```json
[
  {
    "id": "p",
    "value": "praenomen"
  },
  {
    "id": "n",
    "value": "nomen"
  },
  {
    "id": "c",
    "value": "cognomen"
  }
]
```

Pieces are not constrained in any way, so you are free to add multiple instances for each type (e.g. several _cognomina_), in the order you prefer. Types are up to you, so you can have e.g. types for first and last names, or for single names, titles, etc.

Also, this is not limited to person names. You might use it for **place names**, eventually also adding prefixes corresponding to designations like "mount", "lake", "river", etc.

Further, in place names, you might also want to define a hierarchy of pieces, from the widest to the narrowest, or vice-versa, like usually done with geolocation systems. For instance, you might have some generic, of course culturally defined areas designations, like "North-East Italy", "Northern France", etc; and then, inside these areas you might want to eventually specify narrower appellations, like "Venice", "Caen"; and even more, specific sites inside these cities, and so forth.

In this scenario, the component allows you to specify _hierarchically ordered types_, with the added benefit of optionally adding a list of preset values for each type. Typically, you will want to have preset values in the widest types, like in the areas sample, while being able to freely type names for the narrowest ones.

If you want to enable this feature, just provide a differently structured thesaurus for the piece types, based on the following principles:

- each type ID ends with `*` if it's a **singleton**, i.e. it can occur only once in the name. Usually, this will be the case for all the types in a hierarchy: for instance, the area region must occur once, and it must be the first type specified as well.

- each type having a **preset list of children** appellations may have any number of child entries among the thesaurus entries. So, if you are defining a type for continent, you might add a thesaurus entry like this (where as per Cadmus convention hierarchy is defined by dots in the IDs):

```json
[
  { "id": "continent*", "value": "continent" },
  { "id": "continent.europe", "value": "Europe" },
  { "id": "continent.n-america", "value": "North America" },
  { "id": "continent.s-america", "value": "South America" },
]
```

In this case, the type entry is just `continent` (where `*` marks it as a singleton). This entry has 3 children, for 3 of the 7 continents. Children are identified by an ID starting with the parent's ID plus a dot (no asterisk modifier is used here). No further nesting beyond this parent-child relation is allowed.

- the hierarchy **order** can be specified with the reserved entry ID `_order`, whose value is a space-delimited list of type IDs.

As a final sample, consider these thesaurus entries:

```json
[
  { "id": "continent*", "value": "continent" },
  { "id": "continent.europe", "value": "Europe" },
  { "id": "continent.n-america", "value": "North America" },
  { "id": "continent.s-america", "value": "South America" },
  { "id": "continent.africa", "value": "Africa" },
  { "id": "continent.asia", "value": "Asia" },
  { "id": "continent.australia", "value": "Australia" },
  { "id": "continent.antarctica", "value": "Antarctica" },
  { "id": "country*", "value": "country" },
  { "id": "region*", "value": "region" },
  { "id": "_order", "value": "continent country site" }
]
```

Here the hierarchy is:

1. continent
2. country
3. region

in this order, as specified by `_order`. In this case, the editor will provide preset lists for continent, while allowing you to freely type names for countries and sites. Pieces will be automatically sorted by the specified order. In the end, the proper name will just store a type (in this case, the ID of a thesaurus entry, e.g. `continent`) and a value (the ID of the preset value, e.g. `continent.europe`; or just a literal value for countries or sites).

## Pipe

A custom pipe is also provided to display a proper name object, resolving IDs into their values, and eventually appending a types legend (the types for each value).

The `properName` concatenates all the name's pieces in their order, eventually followed by their types legend. Usage:

```html
{{ name | cadmusProperName:typeMap:valueMap:keyName:valueName:legend }}
```

- `value`: the value being piped.
- `typeMap`: the types map to lookup in. This can be an array or an object.
- `valueMap`: the values map to lookup in. This can be an array or an object.
- `keyName`: the name of the property corresponding to the key in the map. Used only when map is an array
- of objects.
- `valueName`: the name of the property corresponding to the value in the map. Used only when map is an array
- of objects.
- `legend`: true to append the types legend to the concatenated values.
