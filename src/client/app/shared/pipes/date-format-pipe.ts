/* angular2-moment (c) 2015, 2016 Uri Shaked / MIT Licence */
import { Pipe, PipeTransform } from '@angular/core';
import { format } from 'date-fns';

@Pipe({ name: 'amDateFormat', pure: true })
export class DateFormatPipe implements PipeTransform {
  transform(value: Date | string, ...args: any[]): string {
    args = args || [];
    return format(value, args[0]);
  }
}
