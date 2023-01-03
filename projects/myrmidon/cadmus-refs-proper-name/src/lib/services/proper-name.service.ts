import { Injectable } from '@angular/core';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';

import { TypeThesaurusEntry } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ProperNameService {
  constructor() {}

  private getEntryOrdinal(
    id: string,
    sortedIds: string[],
    next: number
  ): number | undefined {
    if (!sortedIds.length) {
      return undefined;
    }
    const i = sortedIds.indexOf(id);
    return i === -1 ? next : i + 1;
  }

  /**
   * Parse the specified name piece types thesaurus entries,
   * returning a corresponding set of type-entries.
   *
   * @param entries The thesaurus entries.
   * @returns The parsed type thesaurus entries.
   */
  public parseTypeEntries(
    entries: ThesaurusEntry[] | undefined
  ): TypeThesaurusEntry[] {
    if (!entries?.length) {
      return [];
    }

    // _order specifies the prescribed sort order for all the IDs
    let sortedIds: string[] = [];
    const order = entries.find((e) => e.id === '_order');
    if (order) {
      sortedIds = order.value.split(' ').filter((s) => s.length);
    }

    // build types
    let lastParentEntry: TypeThesaurusEntry | undefined;
    let results: TypeThesaurusEntry[] = [];

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      if (entry.id === '_order') {
        continue;
      }

      // id's * suffix means single
      let id = entry.id;
      let single = false;

      if (id.length > 1 && id.endsWith('*')) {
        single = true;
        id = entry.id.substring(0, entry.id.length - 1);
      }

      // id with dot means a child entry, whose parent is the first of the
      // preceding entries without a dot
      let dotIndex = id.indexOf('.');

      if (dotIndex > -1 && lastParentEntry) {
        if (!lastParentEntry.values) {
          lastParentEntry.values = [];
        }
        lastParentEntry.values.push({
          ...entry,
        });
      } else {
        lastParentEntry = {
          id: id,
          value: entry.value,
          single: single,
          ordinal: this.getEntryOrdinal(
            entry.id,
            sortedIds,
            results.length + 1
          ),
        };
        results.push(lastParentEntry);
      }
    }
    return results;
  }

  /**
   * Get all the value entries from the specified set of type thesaurus
   * entries.
   *
   * @param types The type thesaurus entries.
   * @returns A set of value entries.
   */
  public getValueEntries(types: TypeThesaurusEntry[]): ThesaurusEntry[] {
    if (!types?.length) {
      return [];
    }
    types.map((e) => e.values);
    let entries: ThesaurusEntry[] = [];
    for (let i = 0; i < types.length; i++) {
      if (types[i].values?.length) {
        entries = [...entries, ...types[i].values!];
      }
    }
    return entries;
  }
}
