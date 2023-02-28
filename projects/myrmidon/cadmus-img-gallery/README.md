# Cadmus Image Gallery

The image gallery is a minimalist set of components used to:

- show a gallery of images from some online source.
- let users pick an image and annotate it.

The idea is having a Cadmus part to create annotations on images. Its only tasks are (1) presenting a gallery of images to pick from, and (2) allowing users to create rectangular or polygonal regions on the selected image, each linked with a unique ID (a GUID), and optional note and tags.

Once you create these annotations, you will be able to use other parts to link them to any type of specialized data via their ID.

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
