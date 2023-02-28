import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, debounceTime, map, Observable, take } from 'rxjs';

import { createStore, select, withProps } from '@ngneat/elf';
import {
  withEntities,
  withActiveId,
  selectActiveEntity,
  upsertEntities,
  deleteAllEntities,
} from '@ngneat/elf-entities';
import {
  withRequestsCache,
  withRequestsStatus,
  updateRequestStatus,
  selectRequestStatus,
  StatusState,
} from '@ngneat/elf-requests';
import {
  deleteAllPages,
  hasPage,
  PaginationData,
  selectCurrentPageEntities,
  selectPaginationData,
  setCurrentPage,
  setPage,
  updatePaginationData,
  withPagination,
} from '@ngneat/elf-pagination';

import { DataPage } from '@myrmidon/ng-tools';

import {
  GalleryFilter,
  GalleryImage,
  GalleryOptions,
  GalleryService,
  IMAGE_GALLERY_OPTIONS_KEY,
  IMAGE_GALLERY_SERVICE_KEY,
} from './models';

const PAGE_SIZE = 10;

export interface GalleryImageListProps {
  filter: GalleryFilter;
}

@Injectable({ providedIn: 'root' })
export class GalleryListRepository {
  private _store;
  private _lastPageSize: number;
  private _loading$: BehaviorSubject<boolean>;

  public loading$: Observable<boolean>;
  public activeGalleryImage$: Observable<GalleryImage | undefined>;
  public filter$: Observable<GalleryFilter>;
  public pagination$: Observable<PaginationData & { data: GalleryImage[] }>;
  public status$: Observable<StatusState>;

  constructor(
    @Inject(IMAGE_GALLERY_SERVICE_KEY)
    private _service: GalleryService,
    @Inject(IMAGE_GALLERY_OPTIONS_KEY)
    private _options: GalleryOptions
  ) {
    this._loading$ = new BehaviorSubject<boolean>(false);
    this.loading$ = this._loading$.asObservable();

    // create store
    this._store = this.createStore();
    this._lastPageSize = PAGE_SIZE;

    // combine pagination parameters with page data for our consumers
    this.pagination$ = combineLatest([
      this._store.pipe(selectPaginationData()),
      this._store.pipe(selectCurrentPageEntities()),
    ]).pipe(
      map(([pagination, data]) => ({ ...pagination, data })),
      debounceTime(0)
    );

    this.activeGalleryImage$ = this._store.pipe(selectActiveEntity());
    this.filter$ = this._store.pipe(select((state) => state.filter));

    this.filter$.subscribe((filter) => {
      // when filter changed, reset any existing page and move to page 1
      const paginationData = this._store.getValue().pagination;
      console.log('Deleting all pages');
      this._store.update(deleteAllPages());
      this.loadPage(1, paginationData.perPage);
    });

    // the request status
    this.status$ = this._store.pipe(selectRequestStatus('gallery-image-list'));

    // load page 1 and subscribe to pagination
    this.loadPage(1, PAGE_SIZE);
    this.pagination$.subscribe(console.log);
  }

  private createStore(): typeof store {
    const store = createStore(
      { name: 'gallery-image-list' },
      withProps<GalleryImageListProps>({
        filter: {},
      }),
      withEntities<GalleryImage>(),
      withActiveId(),
      withRequestsCache<'gallery-image-list'>(),
      withRequestsStatus(),
      withPagination()
    );

    return store;
  }

  private adaptPage(
    page: DataPage<GalleryImage>
  ): PaginationData & { data: GalleryImage[] } {
    // adapt the server page DataPage<T> to Elf pagination
    return {
      currentPage: page.pageNumber,
      perPage: page.pageSize,
      lastPage: page.pageCount,
      total: page.total,
      data: page.items,
    };
  }

  private addPage(response: PaginationData & { data: GalleryImage[] }): void {
    const { data, ...paginationData } = response;
    this._store.update(
      upsertEntities(data),
      updatePaginationData(paginationData),
      setPage(
        paginationData.currentPage,
        data.map((c) => c.id)
      )
    );
  }

  public loadPage(pageNumber: number, pageSize?: number): void {
    if (!pageSize) {
      pageSize = PAGE_SIZE;
    }
    // if the page exists and page size is the same, just move to it
    if (
      this._store.query(hasPage(pageNumber)) &&
      pageSize === this._lastPageSize
    ) {
      console.log('Page exists: ' + pageNumber);
      this._store.update(setCurrentPage(pageNumber));
      return;
    }

    // reset cached pages if page size changed
    if (this._lastPageSize !== pageSize) {
      this._store.update(deleteAllPages());
      this._lastPageSize = pageSize;
    }

    // load page from server
    this._store.update(updateRequestStatus('gallery-image-list', 'pending'));
    this._loading$.next(true);
    this._service
      .getImages(
        this._store.getValue().filter,
        pageNumber,
        pageSize,
        this._options
      )
      .pipe(take(1))
      .subscribe((page) => {
        this._loading$.next(false);
        this.addPage({ ...this.adaptPage(page), data: page.items });
        this._store.update(
          updateRequestStatus('gallery-image-list', 'success')
        );
      });
  }

  public setFilter(filter: GalleryFilter): void {
    this._store.update((state) => ({ ...state, filter: filter }));
  }

  clearCache() {
    this._store.update(deleteAllEntities(), deleteAllPages());
  }
}