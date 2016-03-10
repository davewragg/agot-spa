/*
 https://manuel-rauber.com/2016/01/05/angular-2-spinner-component/
 */
import {Component, Input, OnDestroy} from 'angular2/core';

@Component({
  selector: 'agot-spinner',
  moduleId: module.id,
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css'],
})
export class SpinnerComponent implements OnDestroy {
  @Input()
  public delay:number = 100;

  @Input()
  public set isRunning(value:boolean) {
    if (!value) {
      this.cancelTimeout();
      return this.isDelayedRunning = false;
    }

    if (this.currentTimeout) {
      return;
    }

    this.currentTimeout = setTimeout(() => {
      this.isDelayedRunning = value;
      this.cancelTimeout();
    }, this.delay);
  }

  private currentTimeout:number;
  private isDelayedRunning:boolean = false;

  ngOnDestroy():any {
    this.cancelTimeout();
  }

  private cancelTimeout():void {
    clearTimeout(this.currentTimeout);
    this.currentTimeout = undefined;
  }


}