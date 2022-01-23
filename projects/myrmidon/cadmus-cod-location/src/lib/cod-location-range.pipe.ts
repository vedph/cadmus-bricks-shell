import { Pipe, PipeTransform } from '@angular/core';
import { CodLocationParser, CodLocationRange } from './cod-location-parser';

@Pipe({
  name: 'codLocationRange',
})
export class CodLocationRangePipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    if (!value) {
      return null;
    }
    if (Array.isArray(value)) {
      return CodLocationParser.rangesToString(value as CodLocationRange[]);
    }
    return CodLocationParser.rangesToString([value as CodLocationRange]);
  }
}
