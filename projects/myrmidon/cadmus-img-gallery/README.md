# Cadmus Image Gallery

The image gallery is a minimalist set of components used to:

- show a gallery of images from some online source.
- let users pick an image and annotate it.

These components are independent from any specific servicing technology; images could be served by IIIF, cloud stores, etc.; you are free to provide your own service to get a page of images, and a single image, with the desired sizes. Even the filters used to browse the list of images are totally open, so that you can define as many filters as you want, according to your own data.

The general idea behind these components is having a Cadmus part to create annotations on images. Its only tasks are (1) presenting a gallery of images to pick from, and (2) allowing users to create rectangular or polygonal regions on the selected image, each linked with a unique ID (a GUID), and optional note and tags.

Once you create these annotations, you will be able to use other parts to link them to any type of specialized data via their ID. So, all what the image annotator does is letting users delimit one or more regions with any geometric shape, associating each with an annotation having a globally unique ID (GUID), and eventually a body consisting of an optional text note, and any number of tags. This way, each annotation (and consequently each region on the image) gets its own unique ID, which can be referenced from elsewhere in the context of the Cadmus database. This allows attaching to portions of images any kind of data and models, all edited in the same environment. Once they are in the database, we can eventually export them by creating W3C annotations, IIIF manifests, etc.

Also, as usual in Cadmus, annotation IDs are opaque (and so they are supposed to be), just like items or parts IDs; yet, at least in the context of the editor more user-friendly IDs are welcome. As explained [here](https://myrmex.github.io/overview/cadmus/dev/concepts/lookup), in other Cadmus parts, user friendly IDs are got via EID's (entity IDs); these are either aliases of entities which already have their own global ID (a GUID), like items; or identifiers assigned to entities inside a part. In both cases, they can be referenced via a lookup UI, where you just type some characters belonging to the ID to get a list of the first matching IDs.

To apply the same approach in the context of image annotations, we just define a convention by which you can assign an EID to any annotation via a tag beginning with `eid_`. For instance, if you draw a rectangle around some region of an image, and assign it the tag `eid_sample`, by convention this means that the annotation linked to that region will get an EID equal to `sample`.

## Gallery

The gallery consists of these components:

- **services**:
  - _gallery service interface_, with its injection token. You will provide your own real-world service, which might draw images from IIIF services, cloud services, etc.
  - a _mock gallery service implementation_, using an online mock images service. This is used during development as a convenient placeholder instead of your custom service.
  - _lorem ipsum service_, used by the mock gallery service to generate image descriptions.
- **components**:
  - _gallery filter_, to define any number of name=value pairs representing filters applied to the gallery images.
  - _gallery images list_, to browse a list of images via a gallery service implementation. The type of implementation used is defined by your consumer application (via DI as specified in `app.module` providers). Both the list and its filter depend on the same repository, which provides paged data to the UI.
  - _gallery image annotator_, to annotate an image picked from a gallery by drawing rectangular or polygonal regions on it.

>Note that this library depends on `@myrmidon/cadmus-img-annotator`, which in turn requires the Annotorious package.

A gallery image is any object implementing the `GalleryImage` interface, which provides the barely minimum properties of each image: a string ID, a URI, a title, and a short description.

A gallery service is any service implementing the `GalleryService` interface, having just two methods: one to retrieve a page of images, and another to retrieve a single image. In both cases, you can specify image options (first of all the size) via options, which implement interface `GalleryOptions`.

Also, the list of images in the gallery can be filtered using an implementation of `GalleryFilter`. This is just a set of key/value pairs, both represented by strings. Usually you will draw a set of keys to show in the filter UI from some thesaurus.

For instance, to filter images by title you will set a filter property with key=`title` and value equal to any portion of the title to match.
