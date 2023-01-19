import { Observable, of } from 'rxjs';

import { Injectable } from '@angular/core';
import { DataPinInfo } from '@myrmidon/cadmus-core';
import { ErrorWrapper, DataPage } from '@myrmidon/ng-tools';

const EIDS = [
  'alpha',
  'beta',
  'delta',
  'epsilon',
  'eta',
  'gamma',
  'theta',
  'waw',
  'zeta',
];

/**
 * A partial mock of ItemService used only to feed
 * the lookup functions of the asserted IDs brick.
 */
@Injectable({
  providedIn: 'root',
})
export class MockItemService {
  constructor() {}

  public searchPins(
    query: string,
    pageNumber: number,
    pageSize: number
  ): Observable<ErrorWrapper<DataPage<DataPinInfo>>> {
    // just support pin value with operator ^=, as this is what
    // is required by the brick being tested with this mock
    const m = query.match(/\[value\^=([^\]]+)\]/);
    if (!m) {
      return of({
        error: 'Invalid syntax!',
      });
    }

    // paginate
    let eids: string[] = EIDS.filter((eid) => eid.startsWith(m[1]));
    const skip = (pageNumber - 1) * pageSize;
    if (skip > eids.length) {
      return of({
        error: 'Out of pages range',
      });
    }
    eids = eids.slice(skip, skip + pageSize);

    // wrap results
    return of({
      value: {
        pageNumber: pageNumber,
        pageSize: pageSize,
        pageCount: 1,
        total: eids.length,
        items: eids.map((eid) => {
          return {
            itemId: 'item-' + eid,
            partId: '',
            roleId: null,
            partTypeId: 'type',
            name: 'eid',
            value: eid,
          };
        }),
      },
    });
  }
}
