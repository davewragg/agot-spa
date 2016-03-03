import {Input, Component} from 'angular2/core';
import {NgPluralize} from './ng2-pluralize';

@Component({
  selector: 'agot-count',
  template: `<ng-pluralize [count]="count"
                  [when]="{'0': 'none',
                  'one': 'once',
                  '2': 'twice',
                  'other': '{} times'}"></ng-pluralize>`,
  directives: [NgPluralize]
})
export class CountComponent {
  @Input()
  count:number;
}
