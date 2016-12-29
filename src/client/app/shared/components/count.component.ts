import { Input, Component } from '@angular/core';
// import { NgPluralizeComponent } from './ng2-pluralize';

@Component({
  moduleId: module.id,
  selector: 'agot-count',
  template: `<ng-pluralize [count]="count"
                  [when]="{'0': 'none',
                  'one': 'once',
                  '2': 'twice',
                  'other': '{} times'}"></ng-pluralize>`,
  // directives: [NgPluralizeComponent]
})
export class CountComponent {
  @Input()
  count: number;
}
