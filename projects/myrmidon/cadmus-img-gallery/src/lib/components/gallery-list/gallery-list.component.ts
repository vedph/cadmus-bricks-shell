import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Observable, Subscription, distinctUntilChanged } from 'rxjs';

import { PaginationData } from '@ngneat/elf-pagination';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';

import { GalleryListRepository } from '../../gallery-list.repository';
import { GalleryOptions } from '../../models';
import { GalleryOptionsService } from '../../services/gallery-options.service';
import { GalleryImage } from '@myrmidon/cadmus-img-annotator';

@Component({
  selector: 'cadmus-gallery-list',
  templateUrl: './gallery-list.component.html',
  styleUrls: ['./gallery-list.component.css'],
})
export class GalleryListComponent implements OnDestroy {
  private _sub?: Subscription;

  public pagination$: Observable<PaginationData>;
  public data$: Observable<GalleryImage[]>;
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

  public options: GalleryOptions;

  constructor(
    private _repository: GalleryListRepository,
    options: GalleryOptionsService
  ) {
    this.pagination$ = _repository.pagination$;
    this.data$ = _repository.data$;
    this.loading$ = _repository.loading$;
    this.imagePick = new EventEmitter<GalleryImage>();

    this.options = options.get();
    // update options when options change
    this._sub = options
      .select()
      .pipe(distinctUntilChanged())
      .subscribe((o) => (this.options = o));
  }

  public ngOnDestroy(): void {
    this._sub?.unsubscribe();
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
