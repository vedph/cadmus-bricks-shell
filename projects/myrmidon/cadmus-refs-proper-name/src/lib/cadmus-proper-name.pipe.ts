import { Pipe, PipeTransform } from '@angular/core';
import { ProperName } from './proper-name/proper-name.component';

/**
 * Cadmus ProperName pipe to show the full name by concatenating
 * all the name's pieces in their order.
 * Usage: {{ name | cadmusProperName }}
 */
@Pipe({
  name: 'cadmusProperName',
})
export class CadmusProperNamePipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    if (!value) {
      return null;
    }
    const name = value as ProperName;
    if (!name.pieces?.length) {
      return null;
    }
    return name.pieces.map((n) => n.value).join(' ');
  }
}
