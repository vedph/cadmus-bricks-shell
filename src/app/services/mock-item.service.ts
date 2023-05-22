import { Observable, of } from 'rxjs';

import { Injectable } from '@angular/core';
import {
  DataPinInfo,
  Item,
  ItemFilter,
  ItemInfo,
  Part,
} from '@myrmidon/cadmus-core';
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

interface MetadataPart extends Part {
  metadata: {
    type?: string;
    name: string;
    value: string;
  }[];
}

/**
 * A partial mock of ItemService used only to feed
 * the lookup functions of the asserted IDs brick.
 */
@Injectable({
  providedIn: 'root',
})
export class MockItemService {
  private _guidNr: number;
  private _items: Item[];
  private _parts: Part[];

  constructor() {
    this._guidNr = 0;
    // create one mock item for each item in EIDS
    this._items = [];
    this._parts = [];
    const now = new Date();
    for (let i = 0; i < EIDS.length; i++) {
      const item: Item = {
        id: this.getNextGuid(i),
        title: `Item ${i}: ${EIDS[i]}`,
        description: `Item ${i} description`,
        facetId: 'default',
        groupId: '',
        sortKey: 'item' + i.toString().padStart(2, '0'),
        flags: 0,
        parts: [],
        timeCreated: now,
        timeModified: now,
        creatorId: 'zeus',
        userId: 'zeus',
      };
      // add metadata part with eid=EIDS[i]
      const part: MetadataPart = {
        id: this.getNextGuid(),
        itemId: item.id,
        typeId: 'it.vedph.metadata',
        roleId: '',
        timeCreated: now,
        timeModified: now,
        creatorId: 'zeus',
        userId: 'zeus',
        metadata: [{ name: 'eid', value: EIDS[i] }],
      };
      item.parts = [part];
      this._parts.push(part);
      this._items.push(item);
    }
  }

  public searchPins(
    query: string,
    pageNumber: number,
    pageSize: number
  ): Observable<ErrorWrapper<DataPage<DataPinInfo>>> {
    // just support pin value with operator *=, as this is what
    // is required by the brick being tested with this mock
    // TODO add more query params for new lookup
    console.log(query);
    const m = query.match(/\[value\*=([^\]]+)\]/);
    if (!m) {
      return of({
        error: 'Invalid syntax!',
      });
    }

    // paginate
    let eids: string[] = EIDS.filter((eid) => eid.includes(m[1]));
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
            itemId: this.getNextGuid(EIDS.indexOf(eid) + 1),
            partId: this.getNextGuid(),
            roleId: null,
            partTypeId: 'it.vedph.metadata',
            name: 'eid',
            value: eid,
          };
        }),
      },
    });
  }

  private getNextGuid(n?: number): string {
    const nr = n || ++this._guidNr;
    return '71821d42-dd44-4d1e-a78a-' + nr.toString().padStart(12, '0');
  }

  public getItem(id: string, parts: boolean): Observable<Item | null> {
    const item = this._items.find((i) => i.id === id);
    if (!item) {
      return of(null);
    }
    const result = { ...item };
    if (!parts) {
      result.parts = undefined;
    }
    return of(result);
  }

  /**
   * Get a page of items matching the specified filters.
   *
   * @param filter The items filter.
   * @returns Observable with paged result.
   */
  public getItems(
    filter: ItemFilter,
    pageNumber = 1,
    pageSize = 20
  ): Observable<DataPage<ItemInfo>> {
    let items = this._items.filter((i) => {
      if (filter.title && !i.title.includes(filter.title)) {
        return false;
      }
      if (filter.description && !i.description.includes(filter.description)) {
        return false;
      }
      if (filter.facetId && i.facetId !== filter.facetId) {
        return false;
      }
      if (filter.groupId && i.groupId !== filter.groupId) {
        return false;
      }
      if (filter.userId && i.userId !== filter.userId) {
        return false;
      }
      if (filter.minModified && i.timeModified < filter.minModified) {
        return false;
      }
      if (filter.maxModified && i.timeModified > filter.maxModified) {
        return false;
      }
      // flags: not implemented
      return true;
    });

    const skip = (pageNumber - 1) * pageSize;
    if (skip > items.length) {
      throw new Error('Out of pages range');
    }
    items = items.slice(skip, skip + pageSize);

    // wrap results
    return of({
      pageNumber: pageNumber,
      pageSize: pageSize,
      pageCount: 1,
      total: items.length,
      items: items,
    });
  }

  public getPartFromTypeAndRole(
    id: string,
    type: string,
    role?: string
  ): Observable<Part> {
    return of({
      id: id,
      typeId: type,
      roleId: role,
      itemId: this.getNextGuid(1),
      timeCreated: new Date(),
      timeModified: new Date(),
      creatorId: 'zeus',
      userId: 'zeus',
      // metadata part
      metadata: [
        {
          name: 'eid',
          value: 'item-eid',
        },
      ],
    });
  }
}
