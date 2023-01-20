# CadmusRefsAssertedIds

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.1.0.

## Model

The asserted ID and asserted IDs bricks provide a way to include external or internal references to resource identifiers, whatever their type and origin.

The asserted ID brick allows editing a simple model representing such IDs, having:

- a value, the ID itself.
- a scope, representing the context the ID originates from (e.g. an ontology, a repository, a website, etc.).
- an optional tag, eventually used to group or classify the ID.
- an optional assertion, eventually used to define the uncertainty level of the assignment of this ID to the context it applies to.

The asserted IDs brick is just a collection of such IDs.

## Behavior

In both cases, the component provides a special mechanism for internal, pin-based lookup. In most cases, human users prefer to adopt friendly IDs, which are unique only in the context of their editing environment. Such identifiers are typically named EIDs, and may be found scattered among parts, or linked to items via a metadata part.

For instance, a decorations part in a manuscript collects a number of decorations, and for each one it might define an EID used to identify it. When filling the decorations part with data, users just ensure that this EID is unique in the context of the list he is editing. Yet, should we be in need of a non-scoped, unique ID, it would be easy to build it by assembling together the EID with its part/item IDs, which by definition are globally unique. For instance, this is what can be done when mapping entities from parts into a semantic graph (via mapping rules).

In other cases, we might also want to assign a human friendly ID to the item itself, rather than referring to it by its GUID. In this case, the conventional method relies on the generic metadata part, which allows users entering any number of arbitrarily defined name=value pairs. So, a user might enter a pair like e.g. `eid=vat_lat_123`, and use it as the human friendly identifier for a manuscript item corresponding to Vat. Lat. 123.

So, in the end these are the basic requirements for building non-scoped, unique IDs from scoped, human-friendly identifiers:

- we must be able to draw EIDs from parts or from items, assuming the convention by which an item can be assigned an EID via its generic metadata part.
- we must let users pick the preferred combination of components which once assembled build a unique, yet human-friendly identifier.

To this end, the asserted ID component provides an internal lookup mechanism based on data pins and metadata conventions. When users want to add an ID referring to some internal entity, either found in a part or corresponding to an item, he just has to pick the type of desired lookup (when more than a single lookup search definition is present), and type some characters to get the first N pins starting with these characters; he can then pick one from the list. Once a pin value is picked, the lookup control shows all the relevant data which can be used as components for the ID to build:

- the item GUID.
- the item title.
- the part GUID.
- the part type ID.
- the item's metadata part entries.

The user can then use buttons to append each of these components to the ID being built, and/or variously edit it. When he's ok with the ID, he can then use it as the reference ID being edited.
