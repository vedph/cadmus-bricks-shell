import { Injectable } from '@angular/core';
import {
  RefLookupFilter,
  RefLookupService,
} from '@myrmidon/cadmus-refs-lookup';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { DbpediaDoc, DbpediaOptions, DbpediaService } from './dbpedia.service';

@Injectable({
  providedIn: 'root',
})
export class DbpediaRefLookupService implements RefLookupService {
  constructor(private _dbpedia: DbpediaService) {}

  public lookup(
    filter: RefLookupFilter,
    options?: DbpediaOptions
  ): Observable<DbpediaDoc[]> {
    if (!filter.text) {
      return of([]);
    }
    if (options) {
      options.limit = filter.limit;
    }
    return this._dbpedia.lookup(filter.text, options).pipe(
      map((r) => {
        return r.docs;
      })
    );
  }

  public getName(item: DbpediaDoc): string {
    return item?.label[0];
  }
}
