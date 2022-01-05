import { Pipe, PipeTransform } from '@angular/core';
import {
  HistoricalDate,
  HistoricalDateModel,
} from './historical-date/historical-date';

/**
 * A pipe to display HistoricalDate's.
 * Usage:
 *   value | historicalDate:type
 * All the arguments are optional: type defaults to 'text'.
 * Set type to 'value' if you want to get the sort value
 * instead of the textual representation.
 * Example:
 *   {{ date | historicalDate:'value' }}
 */
@Pipe({
  name: 'historicalDate',
})
export class HistoricalDatePipe implements PipeTransform {
  transform(value: unknown, type: 'text' | 'value' = 'text'): unknown {
    if (!value) {
      return null;
    }
    const d = value as HistoricalDateModel;
    if (!d.a) {
      return null;
    }
    if (type === 'value') {
      return new HistoricalDate(d).getSortValue();
    } else {
      return new HistoricalDate(d).toString();
    }
  }
}
