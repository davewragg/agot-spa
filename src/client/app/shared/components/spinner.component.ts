/*
 https://manuel-rauber.com/2016/01/05/angular-2-spinner-component/
 */
import { Component, Input, OnDestroy } from '@angular/core';
import Timer = NodeJS.Timer;

@Component({
  moduleId: module.id,
  selector: 'agot-spinner',
  templateUrl: 'spinner.component.html',
  styleUrls: ['spinner.component.css'],
})
export class SpinnerComponent implements OnDestroy {
  @Input()
  public delay: number = 100;

  public isDelayedRunning: boolean = false;

  @Input()
  public set isRunning(value: boolean) {
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
  private currentTimeout: Timer;

  ngOnDestroy(): any {
    this.cancelTimeout();
  }

  private cancelTimeout(): void {
    clearTimeout(this.currentTimeout);
    this.currentTimeout = undefined;
  }


}
