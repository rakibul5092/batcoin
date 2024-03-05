import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'summary',
})
export class SummaryPipe implements PipeTransform {
  transform(value: string, limit: number, ...args: any[]): string {
    if (!value) return null;

    const desiredLimit = limit ? limit : 50;

    return value.substr(0, desiredLimit) + '...';
  }
}
