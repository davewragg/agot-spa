import { Input, Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'agot-count',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-pluralize [count]="count"
                  [when]="{'0': 'none',
                  'one': 'once',
                  '2': 'twice',
                  'other': '{} times'}"></ng-pluralize>`,
})
export class CountComponent {
  @Input()
  count: number;
}
