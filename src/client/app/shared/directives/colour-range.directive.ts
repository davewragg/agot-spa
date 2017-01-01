import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[agotColourRange]',
  // properties: [
  //   'value: agotColourRange'
  // ],
})
export class ColourRangeDirective {
  value: number;

  @HostBinding('class.text-danger')
  get dismal() {
    return this.value < 35;
  }

  @HostBinding('class.text-warning')
  get tolerable() {
    return this.value >= 35 && this.value < 66;
  }

  @HostBinding('class.text-success')
  get acceptable() {
    return this.value >= 66;
  }
}
