/**
 * https://github.com/vladimir-ivanov/ng2-pluralize
 * adapted for tslint and change strategy
 * */
import {Input, Component, ChangeDetectionStrategy, OnChanges} from 'angular2/core';

@Component({
  selector: 'ng-pluralize',
  template: `<span>{{content}}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPushObserve,
})
export class NgPluralize implements OnChanges {
  @Input()
  count:number;
  @Input()
  when:any;
  @Input()
  offset:number;

  content:string;

  ngOnChanges(changes:{}):any {
    this.setContent();
  }

  private setContent() {
    let when = this.when;
    let count = this.count;
    let oneOffset = this.offset ? this.offset + 1 : 1;
    let remainingOffset = this.offset ? count - this.offset : count;
    let content = when[0] || '';

    if (this.when) {
      if (when[count]) {
        content = when[count];
      } else {
        if (count === oneOffset && when.one) {
          content = when.one;
        } else {
          content = when.other || '';
        }
      }

      content = content.replace('{}', remainingOffset);
    }

    this.content = content;
  };
}
