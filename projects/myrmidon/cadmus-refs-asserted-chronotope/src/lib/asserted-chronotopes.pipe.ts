import { Pipe, PipeTransform } from '@angular/core';
import { HistoricalDate } from '@myrmidon/cadmus-refs-historical-date';

import { AssertedChronotope } from './asserted-chronotope/asserted-chronotope.component';

/**
 * Asserted chronotope(s) pipe. This transforms a single chronotope or
 * an array of chronotopes into a string. Example:
 * chronotopes | assertedChronotopes
 */
@Pipe({
  name: 'assertedChronotopes',
})
export class AssertedChronotopesPipe implements PipeTransform {
  private chronotopeToString(chronotope: AssertedChronotope): string {
    const sb: string[] = [];

    // place
    if (chronotope.place) {
      if (chronotope.place.tag) {
        sb.push(`[${chronotope.place.tag}]`);
      }
      if (chronotope.place.value) {
        if (chronotope.place.tag) {
          sb.push(' ');
        }
        sb.push(chronotope.place.value);
      }
    }

    // date
    if (chronotope.date) {
      if (sb.length > 0) {
        sb.push(', ');
      }
      sb.push(new HistoricalDate(chronotope.date).toString());
    }

    return sb.join('');
  }

  public transform(
    value: AssertedChronotope[] | AssertedChronotope | null | undefined,
    max = 0
  ): string | null {
    if (!value) {
      return null;
    }
    if (Array.isArray(value)) {
      if (!value?.length) {
        return null;
      }
      return (value as AssertedChronotope[])
        .map((c) => this.chronotopeToString(c))
        .join('; ');
    } else {
      return this.chronotopeToString(value);
    }
  }
}
