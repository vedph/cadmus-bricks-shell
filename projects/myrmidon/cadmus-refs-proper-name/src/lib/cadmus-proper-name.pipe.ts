import { Pipe, PipeTransform } from '@angular/core';
import { ProperName } from './models';

/**
 * Cadmus ProperName pipe to show the full name by concatenating
 * all the name's pieces in their order, eventually followed by
 * their types legend. Usage:
 * {{ name | cadmusProperName:typeMap:valueMap:keyName:valueName:legend }}
 *
 * @param value The value being piped.
 * @param typeMap The types map to lookup in. This can be an array
 * or an object.
 * @param valueMap The values map to lookup in. This can be an array
 * or an object.
 * @param keyName The name of the property corresponding
 * to the key in the map. Used only when map is an array
 * of objects.
 * @param valueName The name of the property corresponding
 * to the value in the map. Used only when map is an array
 * of objects.
 * @param legend True to append the types legend to the concatenated
 * values.
 */
@Pipe({
  name: 'cadmusProperName',
})
export class CadmusProperNamePipe implements PipeTransform {
  private getMappedValue(
    value: string | undefined | null,
    map: Array<any> | Object | undefined | null,
    keyName: string,
    valueName: string
  ): string | null {
    if (!value) {
      return null;
    }
    if (Array.isArray(map)) {
      // array of objects with keyName=valueName
      if (!valueName) {
        return value;
      }
      const m = map as Array<any>;
      const item = m.find((i) => i[keyName] === value);
      return item ? item[valueName] : value;
    } else {
      // single object
      const m = map as any;
      return m[value] ? m[value] : value;
    }
  }

  transform(
    value: ProperName | undefined | null,
    typeMap?: Array<any> | Object | undefined | null,
    valueMap?: Array<any> | Object | undefined | null,
    keyName = 'id',
    valueName = 'value',
    legend = false
  ): unknown {
    if (!value) {
      return null;
    }

    const name = value as ProperName;
    if (!name.pieces?.length) {
      return null;
    }

    const values: string[] = [];
    const types: string[] = [];

    for (let i = 0; i < name.pieces.length; i++) {
      const piece = name.pieces[i];
      const value = valueMap
        ? this.getMappedValue(piece.value, valueMap, keyName, valueName)
        : piece.value;
      values.push(value || '');

      if (legend) {
        const type = typeMap
          ? this.getMappedValue(piece.type, typeMap, keyName, valueName)
          : piece.type;
        types.push(type || '');
      }
    }

    return legend && types.length
      ? values.join(' ') + ' (' + types.join(' ') + ')'
      : values.join(' ');
  }
}
