import { Injectable } from '@angular/core';
import {
  RefLookupFilter,
  RefLookupService,
} from '@myrmidon/cadmus-refs-lookup';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ViafService } from './viaf.service';

@Injectable({
  providedIn: 'root',
})
export class ViafRefLookupService implements RefLookupService {
  constructor(private _viaf: ViafService) {}

  lookup(filter: RefLookupFilter, options?: any): Observable<any[]> {
    if (!filter.text) {
      return of([]);
    }
    return this._viaf.suggest(filter.text).pipe(
      map((r) => {
        return r.result;
      })
    );
  }

  getName(item: any): string {
    // ID = item?.viafid
    return item?.displayForm;
  }
}
