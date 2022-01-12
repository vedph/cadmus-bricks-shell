import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe used to intersect an array with another provided as the pipe's
 * argument, e.g. "myArray | arrayIntersect:anotherArray".
 */
@Pipe({
  name: 'arrayIntersect',
})
export class ArrayIntersectPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    if (
      !value ||
      !value.length ||
      !args.length ||
      !args[0]?.length ||
      !Array.isArray(value) ||
      !Array.isArray(args[0])
    ) {
      return value;
    }
    // array intersection
    const a: [] = [...(value as [])];
    const b = new Set(args[0] as []);
    for (let i = a.length - 1; i > -1; i--) {
      if (!b.has(a[i])) {
        a.splice(i, 1);
      }
    }
    return a;

    // https://stackoverflow.com/questions/1885557/simplest-code-for-array-intersection-in-javascript
    // const setB = new Set(args[0] as []);
    // return [...new Set(value as [])].filter((x) => setB.has(x));
  }
}
