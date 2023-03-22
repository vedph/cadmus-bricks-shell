import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  GalleryFilter,
  GalleryImage,
  GalleryOptions,
} from '@myrmidon/cadmus-img-gallery';
import { DataPage } from '@myrmidon/ng-tools';
import { Observable, of, switchMap, take, tap } from 'rxjs';

export interface SimpleIiifGalleryOptions extends GalleryOptions {
  manifestUri: string;
  /**
   * The path to the array of objects representing the images
   * to be served by the gallery.
   */
  arrayPath: string;
  /**
   * The path to the image data for each item in the array targeted
   * by arrayPath.
   */
  itemPath: string;
}

/**
 * Simple IIIF gallery service. This is an essential IIIF service which
 * loads a list of images from a JSON manifest, extracting it from a
 * designated path. The list is cached in memory, and gets reloaded only
 * if its source parameters are changed.
 */
@Injectable({
  providedIn: 'root',
})
export class SimpleIiifGalleryService {
  private _options?: SimpleIiifGalleryOptions;
  private _images: GalleryImage[];

  constructor(private _http: HttpClient) {
    this._images = [];
  }

  private parseStepIndex(step: string): { step: string; index: number } | null {
    const i = step.indexOf('[');
    if (i === -1) {
      return null;
    }
    return {
      step: step.substring(0, i),
      index: +step.substring(i + 1, step.length - 1),
    };
  }

  /**
   * Get the property targeted by path in the received target object.
   *
   * @param target The object targeted by path.
   * @param path The path to the property starting from the object.
   * This is a string where each step is separated by a slash, and
   * represents either a property name (e.g. /x), or an array property
   * name with an indexer (e.g. /x[3]).
   * @returns The property, or null if path not matched. When not null,
   * the result is cast to T.
   */
  public getProperty<T>(target: object | any[], path: string): T | null {
    let t: any = target;
    const steps = path.split('/').filter((s) => s);
    for (let i = 0; i < steps.length; i++) {
      const si = this.parseStepIndex(steps[i]);
      if (si) {
        if (!Array.isArray(t[si.step])) {
          return null;
        }
        t = t[si.step][si.index];
      } else {
        t = t[steps[i]];
      }
      if (!t) {
        return null;
      }
    }
    return t as T;
  }

  private readManifest(manifest: any, options: SimpleIiifGalleryOptions): void {
    // TODO read manifest using paths
  }

  private load(options: SimpleIiifGalleryOptions): void {
    this._http
      .get(options.baseUri)
      .pipe(take(1))
      .subscribe((manifest) => {
        this._options = options;
        this.readManifest(manifest, options);
      });
  }

  private isSourceChanged(options: SimpleIiifGalleryOptions): boolean {
    if (!this._options) {
      return true;
    }
    return (
      this._options.baseUri !== options.baseUri ||
      this._options.arrayPath !== options.arrayPath ||
      this._options.itemPath !== options.itemPath
    );
  }

  private getCachedImages(
    filter: GalleryFilter,
    pageNumber: number,
    pageSize: number
  ): DataPage<GalleryImage> {
    // get filtered images
    // TODO: implement filter
    const filtered = this._images;

    // get page
    const skip = (pageNumber - 1) * pageSize;
    const pageCount = Math.ceil(filtered.length / pageSize);

    if (skip > filtered.length) {
      return {
        total: filtered.length,
        pageCount: pageCount,
        pageNumber: pageNumber,
        pageSize: pageSize,
        items: [],
      };
    }

    return {
      total: filtered.length,
      pageCount: pageCount,
      pageNumber: pageNumber,
      pageSize: pageSize,
      items: filtered.slice(skip, skip + pageSize),
    };
  }

  /**
   * Get the specified page of gallery images.
   *
   * @param filter The filter.
   * @param pageNumber The page number.
   * @param pageSize The page size.
   * @param options The gallery options.
   */
  public getImages(
    filter: GalleryFilter,
    pageNumber: number,
    pageSize: number,
    options: SimpleIiifGalleryOptions
  ): Observable<DataPage<GalleryImage>> {
    // load if options changed
    if (this.isSourceChanged(options)) {
      return this._http.get<any>(options.baseUri).pipe(
        take(1),
        switchMap((m: any) => {
          this._options = options;
          this.readManifest(m, options);
          return of(this.getCachedImages(filter, pageNumber, pageSize));
        })
      );
    } else {
      return of(this.getCachedImages(filter, pageNumber, pageSize));
    }
  }

  private buildUri(id: string, options: SimpleIiifGalleryOptions): string {
    // use options.width, options.height, etc.
    // TODO
    return options.baseUri;
  }

  /**
   * Get the specified image.
   *
   * @param id The image ID.
   * @param options The image options.
   */
  public getImage(
    id: string,
    options: SimpleIiifGalleryOptions
  ): Observable<GalleryImage | null> {
    // load if options changed
    if (this.isSourceChanged(options)) {
      return this._http.get<any>(options.baseUri).pipe(
        take(1),
        switchMap((m: any) => {
          this._options = options;
          this.readManifest(m, options);
          const i = +id - 1;
          if (i >= this._images.length) {
            return of(null);
          }
          // rebuild the URI as size must be drawn from options
          const image = {
            ...this._images[i],
            uri: this.buildUri(id, options),
          };
          return of(image);
        })
      );
    } else {
      const i = +id - 1;
      if (i >= this._images.length) {
        return of(null);
      }
      // rebuild the URI as size must be drawn from options
      const image = {
        ...this._images[i],
        uri: this.buildUri(id, options),
      };
      return of(image);
    }
  }
}
