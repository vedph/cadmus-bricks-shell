import { Observable } from 'rxjs';

import { DataPage } from '@myrmidon/ng-tools';

/**
 * The key used for DI of the gallery server options.
 * Provide it in your consumer app module under providers:
 * {
 *   provider: GALLERY_IMAGE_OPTIONS_KEY,
 *   useValue: YOUR_OPTIONS_CONSTANT_OBJECT
 * }
 */
export const IMAGE_GALLERY_OPTIONS_KEY = 'cadmusImgGalleryOptions';

/**
 * The key used for DI of the gallery service.
 * Provide it in your consumer app module under providers:
 * {
 *   provider: GALLERY_IMAGE_SERVICE_KEY,
 *   useValue: YOUR_OPTIONS_CONSTANT_OBJECT
 * }
 */
export const IMAGE_GALLERY_SERVICE_KEY = 'cadmusImgGalleryService';

/**
 * Essential metadata for a gallery image. You can derive your own model
 * from this one.
 */
export interface GalleryImage {
  id: string;
  uri: string;
  title: string;
  description?: string;
}

export interface GalleryOptions {
  baseUri: string;
  width?: number;
  height?: number;
}

/**
 * A generic filter consisting of name:value pairs where both name and
 * value are strings.
 */
export type GalleryFilter = { [key: string]: string };

/**
 * Gallery image service interface.
 */
export interface GalleryService {
  /**
   * Get the specified page of gallery images.
   *
   * @param filter The filter.
   * @param pageNumber The page number.
   * @param pageSize The page size.
   * @param options The gallery options.
   */
  getImages(
    filter: GalleryFilter,
    pageNumber: number,
    pageSize: number,
    options: GalleryOptions
  ): Observable<DataPage<GalleryImage>>;

  /**
   * Get the specified image.
   *
   * @param id The image ID.
   * @param options The image options.
   */
  getImage(
    id: string,
    options: GalleryOptions
  ): Observable<GalleryImage | null>;
}
