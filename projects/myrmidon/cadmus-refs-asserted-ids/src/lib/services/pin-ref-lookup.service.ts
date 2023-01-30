import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';

import { ItemService } from '@myrmidon/cadmus-api';
import { DataPinInfo, IndexLookupDefinition } from '@myrmidon/cadmus-core';
import {
  RefLookupFilter,
  RefLookupService,
} from '@myrmidon/cadmus-refs-lookup';
import { DataPage, ErrorWrapper } from '@myrmidon/ng-tools';

/**
 * Cadmus pin-based lookup data service. The text being searched here is just
 * the pin's value, according to the options specified. These options correspond
 * to an index lookup definition. The resulting items are of type DataPinInfo.
 */
@Injectable({
  providedIn: 'root',
})
export class PinRefLookupService implements RefLookupService {
  constructor(private _itemService: ItemService) {}

  public getName(item: any | undefined): string {
    return item?.value || '';
  }

  private buildQuery(def: IndexLookupDefinition, text?: string): string {
    const sb: string[] = [];
    const AND = ' AND ';

    if (def.typeId) {
      sb.push(`[partTypeId=${def.typeId}]`);
    }
    if (def.roleId) {
      if (sb.length) {
        sb.push(AND);
      }
      sb.push(`[roleId=${def.roleId}]`);
    }
    if (def.name) {
      if (sb.length) {
        sb.push(AND);
      }
      sb.push(`[name=${def.name}]`);
    }
    if (text) {
      if (sb.length) {
        sb.push(AND);
      }
      // for other operators see backend SqlQueryBuilderBase.cs
      sb.push(`[value*=${text}]`);  // *= is "contains"
    }

    return sb.join('');
  }

  public lookup(filter: RefLookupFilter, options?: any): Observable<any[]> {
    // the index lookup definition is required
    const def = options as IndexLookupDefinition;
    if (!def) {
      return of([]);
    }

    // build the corresponding pin query
    const query = this.buildQuery(def, filter.text);

    // search the index
    return this._itemService.searchPins(query, 1, filter.limit).pipe(
      map((w: ErrorWrapper<DataPage<DataPinInfo>>) => {
        if (w.error) {
          console.error(w.error);
          return [];
        } else {
          return w.value?.items || [];
        }
      })
    );
  }
}
