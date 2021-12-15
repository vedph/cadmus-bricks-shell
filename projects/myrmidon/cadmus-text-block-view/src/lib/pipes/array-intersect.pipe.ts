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
      !args.length ||
      !Array.isArray(value) ||
      !Array.isArray(args[0])
    ) {
      return value;
    }
    // array intersection
    // https://stackoverflow.com/questions/1885557/simplest-code-for-array-intersection-in-javascript
    const setB = new Set(args[0] as []);
    return [...new Set(value as [])].filter((x) => setB.has(x));
  }
}
