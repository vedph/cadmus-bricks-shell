import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ItemService } from '@myrmidon/cadmus-api';
import { Item } from '@myrmidon/cadmus-core';
import {
  RefLookupFilter,
  RefLookupService,
} from '@myrmidon/cadmus-refs-lookup';
import { DataPage } from '@myrmidon/ng-tools';

@Injectable({
  providedIn: 'root',
})
export class ItemRefLookupService implements RefLookupService {
  constructor(private _itemService: ItemService) {}

  public lookup(filter: RefLookupFilter, options?: any): Observable<Item[]> {
    return this._itemService
      .getItems(
        {
          title: filter.text,
        },
        1,
        filter.limit || 10
      )
      .pipe(map((page: DataPage<Item>) => page.items));
  }

  getName(item: Item): string {
    return item?.title;
  }
}
