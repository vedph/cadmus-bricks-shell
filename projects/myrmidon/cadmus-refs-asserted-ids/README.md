# CadmusRefsAssertedIds

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.1.0.

- [CadmusRefsAssertedIds](#cadmusrefsassertedids)
  - [Asserted ID](#asserted-id)
    - [Behavior](#behavior)
    - [Using Scoped ID Lookup](#using-scoped-id-lookup)
  - [Asserted Composite ID](#asserted-composite-id)
    - [Components API](#components-api)
      - [AssertedCompositeIdsComponent](#assertedcompositeidscomponent)
      - [AssertedCompositeIdComponent](#assertedcompositeidcomponent)
      - [PinTargetLookupComponent](#pintargetlookupcomponent)
    - [Target ID Editor](#target-id-editor)
    - [Using PinTargetLookupComponent](#using-pintargetlookupcomponent)

## Asserted ID

The asserted ID and asserted IDs bricks provide a way to include external or internal references to resource identifiers, whatever their type and origin.

The asserted ID brick allows editing a simple model representing such IDs, having:

- a value, the ID itself.
- a scope, representing the context the ID originates from (e.g. an ontology, a repository, a website, etc.).
- an optional tag, eventually used to group or classify the ID.
- an optional assertion, eventually used to define the uncertainty level of the assignment of this ID to the context it applies to.

The asserted IDs brick is just a collection of such IDs.

### Behavior

In both cases, the component provides a special mechanism for internal, pin-based lookup. In most cases, human users prefer to adopt friendly IDs, which are unique only in the context of their editing environment. Such identifiers are typically named EIDs (entity IDs), and may be found scattered among parts, or linked to items via a metadata part.

For instance, a decorations part in a manuscript collects a number of decorations; for each one, it might define an arbitrary EID (like e.g. `angel1`) used to identify it among the others, in the context of that part.

When filling the decorations part with data, users just ensure that this EID is unique in the context of the list they are editing. Yet, should we be in need of a non-scoped, unique ID, it would be easy to build it by assembling together the EID with its part/item IDs, which by definition are globally unique (being GUIDs). For instance, this is what can be done when mapping entities from parts into a semantic graph (via mapping rules).

Also, sometimes we might also want to assign a human-friendly ID to the item itself, rather than referring to it by its GUID. In this case, the conventional method relies on the generic metadata part, which allows users entering any number of arbitrarily defined name=value pairs. So, a user might enter a pair like e.g. `eid=vat_lat_123`, and use it as the human friendly identifier for a manuscript item corresponding to Vat. Lat. 123.

The asserted ID library provides a number of components which can be used to easily refer to the entities identified in this way. According to the scenario illustrated above, the basic requirements for building non-scoped, unique IDs from scoped, human-friendly identifiers are:

- we must be able to draw EIDs _from parts or from items_, assuming the convention by which an item can be assigned an EID via its generic _metadata_ part.
- we must let users pick _the preferred combination_ of components which once assembled build a unique, yet human-friendly identifier.

To this end, the asserted ID component provides an internal lookup mechanism based on data pins and metadata conventions. When users want to add an ID referring to some internal entity, either found in a part or corresponding to an item, he just has to pick the type of desired lookup (when more than a single lookup search definition is present), and type some characters to get the first N pins starting with these characters; he can then pick one from the list. Once a pin value is picked, the lookup control shows all the relevant data which can be used as components for the ID to build:

- the item GUID.
- the item title.
- the part GUID.
- the part type ID.
- the item's metadata part entries.

The user can then use buttons to append each of these components to the ID being built, and/or variously edit it. When he's ok with the ID, he can then use it as the reference ID being edited.

>👉 The demo found in this workspace uses a [mock data service](../../../src/app/services/mock-item.service.ts) instead of the real one, which provides a minimal set of data and functions, just required for the components to function.

### Using Scoped ID Lookup

Apart from the IDs list, you can use the scoped ID lookup control to add a pin-based lookup for any entity in your own UI:

(1) ensure to import this module (`CadmusRefsAssertedIdsModule`).

(2) add a lookup control to your UI, like this:

```html
<!-- lookup -->
<cadmus-scoped-pin-lookup *ngIf="!noLookup" (idPick)="onIdPick($event)"></cadmus-scoped-pin-lookup>
```

In this sample, my UI has a `noLookup` property which can be used to hide the lookup if not required:

```ts
@Input()
public noLookup?: boolean;

public onIdPick(id: string): void {
  // TODO: set your control's value, e.g.:
  // this.myId.setValue(id);
  // this.myId.updateValueAndValidity();
  // this.myId.markAsDirty();
}
```

(3) in your app's `index-lookup-definitions.ts` file, add the required lookup definitions. Each definition has a conventional key, and is an object with part type ID for the lookup scope, and pin name, e.g.:

```ts
import { IndexLookupDefinitions } from '@myrmidon/cadmus-core';
import {
  METADATA_PART_TYPEID,
  HISTORICAL_EVENTS_PART_TYPEID,
} from '@myrmidon/cadmus-part-general-ui';

export const INDEX_LOOKUP_DEFINITIONS: IndexLookupDefinitions = {
  // item's metadata
  meta_eid: {
    typeId: METADATA_PART_TYPEID,
    name: 'eid',
  },
  // general parts
  event_eid: {
    typeId: HISTORICAL_EVENTS_PART_TYPEID,
    name: 'eid',
  },
  // ... etc.
};
```

>Note that while pin name and type will not be displayed to the end user, the key of each definition will. Unless you have a single definition, the lookup component will display a dropdown list with all the available keys, so that the user can select the lookup's scope. So, use short, yet meaningful keys here, like in the above sample (`meta_eid`, `event_eid`).

## Asserted Composite ID

The asserted composite ID and asserted composite IDs bricks provide a way to include _external_ or _internal_ references to resource identifiers, whatever their type and origin. These components are the foundation for pin-based links in links part and links fragment types, as they provide both external and internal links eventually accompanied by an assertion.

Each asserted composite ID has:

- a `target`, representing the pin-based target of the ID. The target model has these properties:
  - a global ID, `gid`, built from the pin or manually defined;
  - a human-friendly `label` for the target, built from the pin or manually defined;
  - for internal links only:
    - `itemId` for the item the pin derives from;
    - when the pin derives from a part, an optional `partId`, `partTypeId`, `roleId`;
    - the `name` and `value` of the pin.
- an optional `scope`, representing the context the ID originates from (e.g. an ontology, a repository, a website, etc.).
- an optional `tag`, eventually used to group or classify the ID.
- an optional `assertion`, eventually used to define the uncertainty level of the assignment of this ID to the context it applies to.

When the ID is external, the only properties set for the target model are `gid` (=the ID) and `label`. You can easily distinguish between an external and internal ID by looking at a property like `name`, which is always present for internal IDs, and never present for external IDs.

There are different options which allow to customize the lookup behavior:

- lookup pin without any filters, except for the always present part type ID and pin name (_by type_); or lookup pin with optional filters for item and any of its parts (_by item_; default).
- the part type ID and pin name filter (i.e. the _index lookup definitions_) can be set from many sources:
  1. directly from the consumer code by setting `lookupDefinitions`;
  2. from injection, when (1) is not used;
  3. from thesaurus `model-types`, when (2) is empty.
- set `pinByTypeMode` to true, to let the editor use in by-type mode instead of by-item;
- set `canSwitchMode` to true, to allow users switch between by-type and by-item modes;
- set `canEditTarget` to true, to allow users edit the link target GID and label also for internal pins, where they are automatically provided by pin lookup.

These options can be variously combined to force users to use a specific behavior only; for instance, if you just want by-type lookup and automatic GID/label, set `pinByTypeMode` to true and `canSwitchMode` and `canEditTarget` to false.

Three components are used for this brick:

- `AssertedCompositeIdsComponent`, the top level editor for the list of IDs. This has buttons to add new internal/external IDs, and a list of existing IDs. Each existing ID has buttons for editing, moving, and deleting it. When editing, the `AssertedIdComponent` is used in an expansion panel.
- `AssertedCompositeIdComponent`, the editor for each single ID. This allows you to edit shared metadata (tag and scope), and specific properties for both external and internal ID.
- `PinTargetLookupComponent`, the editor for an internal ID, i.e. a link target based on pins lookup. This is the core of the editor's logic.

### Components API

#### AssertedCompositeIdsComponent

- 📥 input:
  - `ids` (`AssertedId[]`)
  - `idScopeEntries` (`ThesaurusEntry[]?`): thesaurus `asserted-id-scopes`.
  - `idTagEntries` (`ThesaurusEntry[]?`): thesaurus `asserted-id-tags`.
  - `assTagEntries` (`ThesaurusEntry[]?`): thesaurus `assertion-tags`.
  - `refTypeEntries` (`ThesaurusEntry[]?`): thesaurus `doc-reference-types`.
  - `refTagEntries` (`ThesaurusEntry[]?`): thesaurus `doc-reference-tags`.
  - `pinByTypeMode` (`boolean?`)
  - `canSwitchMode` (`boolean?`)
  - `canEditTarget` (`boolean?`)
  - `defaultPartTypeKey` (`string?|null`)
  - `lookupDefinitions` (`IndexLookupDefinitions?`)
  - `internalDefault` (`boolean?`): true to start a new ID as internal rather than external
- ⚡ output:
  - `idsChange` (`AssertedId[]`)

#### AssertedCompositeIdComponent

- 📥 input:
  - `id` (`AssertedId? | null`)
  - `idScopeEntries` (`ThesaurusEntry[]?`): thesaurus `asserted-id-scopes`.
  - `idTagEntries` (`ThesaurusEntry[]?`): thesaurus `asserted-id-tags`.
  - `assTagEntries` (`ThesaurusEntry[]?`): thesaurus `assertion-tags`.
  - `refTypeEntries` (`ThesaurusEntry[]?`): thesaurus `doc-reference-types`.
  - `refTagEntries` (`ThesaurusEntry[]?`): thesaurus `doc-reference-tags`.
  - `external` (`boolean?`)
  - `hasSubmit` (`boolean?`)
  - `pinByTypeMode` (`boolean?`)
  - `canSwitchMode` (`boolean?`)
  - `canEditTarget` (`boolean?`)
  - `defaultPartTypeKey` (`string?|null`)
  - `lookupDefinitions` (`IndexLookupDefinitions?`)
  - `internalDefault` (`boolean?`): true to start a new ID as internal rather than external
- ⚡ output:
  - `idChange` (`AssertedId`)
  - `editorClose`

#### PinTargetLookupComponent

- 📥 input:
  - `target` (`PinTarget? | null`)
  - `pinByTypeMode` (`boolean?`)
  - `canSwitchMode` (`boolean?`)
  - `canEditTarget` (`boolean?`)
  - `defaultPartTypeKey` (`string?|null`)
  - `lookupDefinitions` (`IndexLookupDefinitions?`)
  - `internalDefault` (`boolean?`): true to start a new ID as internal rather than external
- ⚡ output:
  - `targetChange` (`PinTarget`)
  - `editorClose`

### Target ID Editor

This component provides _two modes_ to get to a pin-based link target:

- **by item** (default mode): the user selects an item from a lookup list; then a part, from the list of the selected item's parts; and finally a pin, from a lookup list of pins filtered by that item's part. This essentially provides a way of selecting a pin from a restricted lookup set.
- **by type**: the user selects the part's type (or this is automatically pre-selected when only a single type is set), and then selects a pin from a lookup list of pins filtered by that part's type. The list of part types may come from several sources:
  - explicitly set via the component `lookupDefinitions` property;
  - if this is not set, the lookup definitions will be got via injection when available;
  - if the injected definitions are empty, the lookup definitions will be built from the `model-types` thesaurus;
  - if this is not available either, the _by-type_ lookup will be disabled.

In both cases, in the end the model is the same; it's just the way the user selects the pin which changes. You can specify the mode for the component with `pinByTypeMode`, and control the possibility of switching between modes with `canSwitchMode`.

Once the user picks a pin, the target is automatically filled with data from the pin itself. Two values are calculated:

- `gid`, the global ID for the target is `P<part-id>/<pin-value>` when the pin is from a part; or `I<item-id>/<pin-value>` when it is from an item only.
- `label`, the human-friendly label for the target, is `<pin-value> | <item-title> (<part-type>[, <part-role>])`, where `<part-type>` is either the human-friendly name of the part type ID (as drawn from the `model-types` thesaurus), or the part type ID itself.

Optionally, users can customize both `gid` and `label` (when `canBuildGid` and `canBuildLabel` are true). As for `gid`, users have access to a full set of metadata about the target, so that they can build their own global ID. Once a pin value is picked, the lookup control shows all the relevant data which can be used as components for the ID to build:

- the item GUID.
- the item title.
- the part GUID.
- the part type ID.
- the item's metadata part entries.

The user can then use buttons to append each of these components to the ID being built, and/or variously edit it. When he's ok with the ID, he can then use it as the reference ID being edited.

>👉 The demo found in this workspace uses a [mock data service](../../../src/app/services/mock-item.service.ts) instead of the real one, which provides a minimal set of data and functions, just required for the components to function.

### Using PinTargetLookupComponent

Apart from the IDs list, you can use the pin-based link target lookup control to add a lookup for any entity in your own UI:

(1) ensure to import this module (`CadmusRefsAssertedIdsModule`).

(2) add a lookup control to your UI, like this:

```html
<!-- lookup -->
<cadmus-pin-target-lookup [canSwitchMode]="true"
                          (targetChange)="onTargetChange($event)">
</cadmus-pin-target-lookup>
```

(3) specify the lookup definitions, either from code, or via injection. In the latter case, in your app's `index-lookup-definitions.ts` file, add the required lookup definitions. Each definition has a conventional key, and is an object with part type ID for the lookup scope, and pin name, e.g.:

```ts
import { IndexLookupDefinitions } from '@myrmidon/cadmus-core';
import {
  METADATA_PART_TYPEID,
  HISTORICAL_EVENTS_PART_TYPEID,
} from '@myrmidon/cadmus-part-general-ui';

export const INDEX_LOOKUP_DEFINITIONS: IndexLookupDefinitions = {
  // item's metadata
  meta_eid: {
    typeId: METADATA_PART_TYPEID,
    name: 'eid',
  },
  // general parts
  event_eid: {
    typeId: HISTORICAL_EVENTS_PART_TYPEID,
    name: 'eid',
  },
  // ... etc.
};
```

>Note that while pin name and type will not be displayed to the end user, the key of each definition will. Unless you have a single definition, the lookup component will display a dropdown list with all the available keys, so that the user can select the lookup's scope. So, use short, yet meaningful keys here, like in the above sample (`meta_eid`, `event_eid`).
