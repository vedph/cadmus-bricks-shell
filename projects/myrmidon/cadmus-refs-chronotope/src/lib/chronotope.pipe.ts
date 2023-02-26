import { Pipe, PipeTransform } from '@angular/core';
import { HistoricalDate } from '@myrmidon/cadmus-refs-historical-date';

import { Chronotope } from './chronotope/chronotope.component';

@Pipe({
  name: 'chronotope',
})
export class ChronotopePipe implements PipeTransform {
  transform(value: Chronotope | null | undefined): string | null {
    if (!value) {
      return null;
    }
    const sb: string[] = [];
    if (value.tag) {
      sb.push(`[${value.tag}]`);
    }
    if (value.place) {
      if (sb.length) {
        sb.push(' ');
      }
      sb.push(value.place);
    }
    if (value.date) {
      if (value.place) {
        sb.push(',');
      }
      if (sb.length) {
        sb.push(' ');
      }
      sb.push(new HistoricalDate(value.date).toString());
    }
    return sb.join('');
  }
}
