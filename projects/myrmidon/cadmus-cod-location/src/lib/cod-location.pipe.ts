import { Pipe, PipeTransform } from '@angular/core';
import { CodLocation, CodLocationParser } from './cod-location-parser';

/**
 * A pipe to display CodLocation's.
 * Usage:
 *   value | codLocation
 * Example:
 *   {{ location | codLocation }}
 */
@Pipe({
  name: 'codLocation',
})
export class CodLocationPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    return CodLocationParser.locationToString(value as CodLocation);
  }
}
