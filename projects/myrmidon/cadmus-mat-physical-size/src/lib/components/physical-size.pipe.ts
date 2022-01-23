import { Pipe, PipeTransform } from '@angular/core';
import { PhysicalSize } from './physical-size/physical-size.component';

@Pipe({
  name: 'physicalSize',
})
export class PhysicalSizePipe implements PipeTransform {
  private getDimensionLabel(value: number, unit?: string): string {
    if (!value) {
      return '';
    }
    let s = value.toFixed(2);
    if (unit) {
      s += ' ' + unit;
    }
    return s;
  }

  transform(value: unknown, ...args: unknown[]): unknown {
    if (!value) {
      return null;
    }
    const size = value as PhysicalSize;
    const sb: string[] = [];

    // determine unique unit if any
    let uniqueUnit: string | undefined = undefined;

    if (size.w?.value) {
      uniqueUnit = size.w.unit;
    }

    if (size.h?.value) {
      if (!uniqueUnit) {
        uniqueUnit = size.h.unit;
      } else if (uniqueUnit !== size.h.unit) {
        uniqueUnit = undefined;
      }
    }

    if (size.d?.value) {
      if (!uniqueUnit) {
        uniqueUnit = size.d.unit;
      } else if (uniqueUnit !== size.d.unit) {
        uniqueUnit = undefined;
      }
    }

    // build string
    if (size.w?.value) {
      sb.push(
        this.getDimensionLabel(
          size.w.value,
          uniqueUnit ? undefined : size.w.unit
        )
      );
    }
    if (size.h?.value) {
      sb.push(
        this.getDimensionLabel(
          size.h.value,
          uniqueUnit ? undefined : size.h.unit
        )
      );
    }
    if (size.d?.value) {
      sb.push(
        this.getDimensionLabel(
          size.d.value,
          uniqueUnit ? undefined : size.d.unit
        )
      );
    }

    return sb.join(' × ') + (uniqueUnit ? ' ' + uniqueUnit : '');
  }
}
