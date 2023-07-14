import { Inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  distinctUntilChanged,
  take,
  tap,
} from 'rxjs';

import { createStore, select, withProps } from '@ngneat/elf';
import {
  withEntities,
  withActiveId,
  selectActiveEntity,
  upsertEntities,
  deleteAllEntities,
} from '@ngneat/elf-entities';
import { withRequestsCache } from '@ngneat/elf-requests';
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

import { GalleryOptionsService } from './services/gallery-options.service';
import {
  GalleryFilter,
  GalleryService,
  IMAGE_GALLERY_SERVICE_KEY,
} from './models';
import { GalleryImage } from '@myrmidon/cadmus-img-annotator';

const PAGE_SIZE = 10;

export interface GalleryImageListProps {
  filter: GalleryFilter;
}

@Injectable({ providedIn: 'root' })
export class GalleryListRepository {
  private _store;
  private _lastPageSize: number;
  private _loading$: BehaviorSubject<boolean>;

  public filter$: Observable<GalleryFilter>;
  // public pagination$: Observable<PaginationData & { data: GalleryImage[] }>;
  public data$: Observable<GalleryImage[]>;
  public pagination$: Observable<PaginationData>;
  public activeGalleryImage$: Observable<GalleryImage | undefined>;
  public loading$: Observable<boolean>;

  constructor(
    @Inject(IMAGE_GALLERY_SERVICE_KEY)
    private _service: GalleryService,
    private _options: GalleryOptionsService
  ) {
    this._loading$ = new BehaviorSubject<boolean>(false);
    this.loading$ = this._loading$.asObservable();

    // create store
    this._store = this.createStore();
    this._lastPageSize = this._options.get().pageSize || PAGE_SIZE;

    // combine pagination parameters with page data for our consumers
    this.pagination$ = this._store.pipe(selectPaginationData());
    this.data$ = this._store.pipe(selectCurrentPageEntities());

    // this.pagination$ = combineLatest([
    //   this._store.pipe(selectPaginationData()),
    //   this._store.pipe(selectCurrentPageEntities()),
    // ]).pipe(
    //   tap(([pagination, data]) => {
    //     console.log('Pagination changed');
    //   }),
    //   map(([pagination, data]) => ({ ...pagination, data })),
    //   debounceTime(0)
    // );

    this.activeGalleryImage$ = this._store.pipe(selectActiveEntity());

    // filter
    this.filter$ = this._store.pipe(select((state) => state.filter));
    this.filter$.subscribe((filter) => {
      // when filter changed, delete existing pages and move to page 1
      const paginationData = this._store.getValue().pagination;
      console.log(
        'Filter changed: deleting all pages: ' + JSON.stringify(filter)
      );
      this._store.update(deleteAllPages());
      //@@
      setTimeout(() => {
        this.loadPage(1, paginationData.perPage);
      });
      // this.loadPage(1, paginationData.perPage);
    });

    // load page 1 and subscribe to pagination
    this.loadPage(1, this._options.get().pageSize || PAGE_SIZE);
    this.pagination$
      .pipe(
        tap((p) => {
          console.log('Pagination changed:');
        })
      )
      .subscribe(console.log);

    // reload page when options change
    this._options
      .select()
      .pipe(distinctUntilChanged())
      .subscribe((options) => {
        console.log('Options changed: ' + JSON.stringify(options));
        this.loadPage(1, options.pageSize || PAGE_SIZE);
      });
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
      pageSize = this._options.get().pageSize || PAGE_SIZE;
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
      console.log('Page size change: deleting all pages');
      this._store.update(deleteAllPages());
      this._lastPageSize = pageSize;
    }

    // load page from server
    console.log(
      'Invoking service with ' + JSON.stringify(this._store.getValue().filter)
    );
    this._loading$.next(true);
    this._service
      .getImages(
        this._store.getValue().filter,
        pageNumber,
        pageSize,
        this._options.get()
      )
      .pipe(take(1))
      .subscribe({
        next: (page) => {
          this._loading$.next(false);
          this.addPage({ ...this.adaptPage(page), data: page.items });
        },
        error: (error) => {
          this._loading$.next(false);
          console.error(error ? JSON.stringify(error) : 'Error loading page');
        },
      });
  }

  clearCache() {
    this._store.update(deleteAllEntities(), deleteAllPages());
  }

  public setFilter(filter: GalleryFilter): void {
    console.log('Setting filter: ' + JSON.stringify(filter));
    this._store.update((state) => ({ ...state, filter: filter }));
  }
}
