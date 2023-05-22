import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Thesaurus } from '@myrmidon/cadmus-core';

@Injectable({
  providedIn: 'root',
})
export class MockThesaurusService {
  private _thesauri: Thesaurus[];

  constructor() {
    this._thesauri = [
      {
        id: 'model-types',
        entries: [
          {
            id: 'it.vedph.metadata',
            value: 'metadata',
          },
          {
            id: 'it.vedph.note',
            value: 'note',
          },
        ],
      },
    ];
  }

  /**
   * Gets the tags set with the specified ID.
   * @param id string The tag set ID.
   * @param emptyIfNotFound True to return an empty thesaurus when the requested
   * thesaurus ID is not found, rather than getting a 404.
   * @returns Tag set.
   */
  public getThesaurus(
    id: string,
    emptyIfNotFound = false
  ): Observable<Thesaurus> {
    const thesaurus = this._thesauri.find((t) => t.id === id);
    if (!thesaurus) {
      if (emptyIfNotFound) {
        return of({ id: id, entries: [] });
      } else {
        throw new Error(`Thesaurus '${id}' not found`);
      }
    } else {
      return of(thesaurus);
    }
  }
}
