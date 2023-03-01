import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'join',
})
export class JoinPipe implements PipeTransform {
  transform(value?: Array<any>, separator = ',', limit = 0): string | null {
    if (!value) {
      return null;
    }
    return (limit ? value.slice(0, limit) : value).join(separator);
  }
}
