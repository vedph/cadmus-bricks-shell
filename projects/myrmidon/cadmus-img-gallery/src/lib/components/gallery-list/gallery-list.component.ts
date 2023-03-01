import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';

import { PaginationData } from '@ngneat/elf-pagination';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';

import { GalleryListRepository } from '../../gallery-list.repository';
import {
  GalleryImage,
  GalleryOptions,
  IMAGE_GALLERY_OPTIONS_KEY,
} from '../../models';

@Component({
  selector: 'cadmus-gallery-list',
  templateUrl: './gallery-list.component.html',
  styleUrls: ['./gallery-list.component.css'],
})
export class GalleryListComponent {
  public pagination$: Observable<PaginationData & { data: GalleryImage[] }>;
  public loading$: Observable<boolean>;

  /**
   * The entries used to represent image gallery metadata filters.
   * Each entry is a metadatum, with ID=metadatum name and value=label.
   * If not set, users will be allowed to freely type a name rather
   * than picking it from a list.
   */
  @Input()
  public entries: ThesaurusEntry[] | undefined;

  /**
   * Emitted when an image is picked.
   */
  @Output()
  public imagePick: EventEmitter<GalleryImage>;

  constructor(
    private _repository: GalleryListRepository,
    @Inject(IMAGE_GALLERY_OPTIONS_KEY)
    public options: GalleryOptions
  ) {
    this.pagination$ = _repository.pagination$;
    this.loading$ = _repository.loading$;
    this.imagePick = new EventEmitter<GalleryImage>();
  }

  public pageChange(event: PageEvent): void {
    this._repository.loadPage(event.pageIndex + 1, event.pageSize);
  }

  public clearCache(): void {
    this._repository.clearCache();
    this._repository.loadPage(1);
  }

  public pickImage(image: GalleryImage): void {
    this.imagePick.emit(image);
  }
}
