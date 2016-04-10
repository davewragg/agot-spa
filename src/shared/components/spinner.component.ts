/*
 https://manuel-rauber.com/2016/01/05/angular-2-spinner-component/
 */
import {Component, Input, OnDestroy} from 'angular2/core';
import Timer = NodeJS.Timer;

@Component({
  selector: 'agot-spinner',
  templateUrl: './shared/components/spinner.component.html',
  styleUrls: ['./shared/components/spinner.component.css'],
})
export class SpinnerComponent implements OnDestroy {
  @Input()
  public delay:number = 100;

  @Input()
  public set isRunning(value:boolean) {
    if (!value) {
      this.cancelTimeout();
      this.isDelayedRunning = false;
      return;
    }

    if (this.currentTimeout) {
      return;
    }

    this.currentTimeout = setTimeout(() => {
      this.isDelayedRunning = value;
      this.cancelTimeout();
    }, this.delay);
  }

  private currentTimeout:Timer;
  private isDelayedRunning:boolean = false;

  ngOnDestroy():any {
    this.cancelTimeout();
  }

  private cancelTimeout():void {
    clearTimeout(this.currentTimeout);
    this.currentTimeout = undefined;
  }


}
