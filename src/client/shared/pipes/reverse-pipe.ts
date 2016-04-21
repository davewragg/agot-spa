import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({name: 'reverse', pure: false})
export class ReversePipe implements PipeTransform {
  transform(value:any[]):any[] {
    return value.reverse();
  }
}
