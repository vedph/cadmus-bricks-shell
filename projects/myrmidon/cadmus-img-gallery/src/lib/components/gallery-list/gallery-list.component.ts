import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Observable, Subscription, distinctUntilChanged } from 'rxjs';

import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { GalleryImage } from '@myrmidon/cadmus-img-annotator';
import { DataPage } from '@myrmidon/ng-tools';

import { GalleryListRepository } from '../../gallery-list.repository';
import { GalleryOptions } from '../../models';
import { GalleryOptionsService } from '../../services/gallery-options.service';

@Component({
  selector: 'cadmus-gallery-list',
  templateUrl: './gallery-list.component.html',
  styleUrls: ['./gallery-list.component.css'],
})
export class GalleryListComponent implements OnDestroy {
  private _sub?: Subscription;

  public page$: Observable<DataPage<GalleryImage>>;
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
    this.page$ = _repository.page$;
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

  public onPageChange(event: PageEvent): void {
    this._repository.setPage(event.pageIndex + 1, event.pageSize);
  }

  public reset(): void {
    this._repository.reset();
  }

  public pickImage(image: GalleryImage): void {
    this.imagePick.emit(image);
  }
}
